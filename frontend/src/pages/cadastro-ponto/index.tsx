import { useState } from "react";
import { pontosApi } from "@/lib/api/pontos";
import { formatHorarioFuncionamento } from "@/lib/horario";
import { Step1DadosPonto } from "./Step1DadosPonto";
import { Step2Endereco } from "./Step2Endereco";
import { Step3HorariosCapacidade } from "./Step3HorariosCapacidade";
import { Sucesso } from "./Sucesso";

type FPonto = {
  nome: string;
  cep: string;
  numero: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  capacidade: string;
  horarioAbertura: string;
  horarioFechamento: string;
  diasSel: string[];
};

const INICIAL: FPonto = {
  nome: "",
  cep: "",
  numero: "",
  logradouro: "",
  bairro: "",
  cidade: "",
  uf: "",
  capacidade: "50",
  horarioAbertura: "08:00",
  horarioFechamento: "18:00",
  diasSel: ["seg", "ter", "qua", "qui", "sex"],
};

// Sem geocodificação de CEP nesta rodada: gera coordenadas próximas ao
// centro de Bauru/SP, só pra o ponto aparecer no mapa (mesma abordagem
// usada no protótipo original do design).
function coordenadaAleatoriaBauru() {
  return {
    latitude: (-22.3145 + (Math.random() - 0.5) * 0.03).toFixed(6),
    longitude: (-49.0605 + (Math.random() - 0.5) * 0.03).toFixed(6),
  };
}

export function CadastroPonto() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [f, setF] = useState<FPonto>(INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function toggleDia(dia: string) {
    setF((prev) => ({
      ...prev,
      diasSel: prev.diasSel.includes(dia) ? prev.diasSel.filter((d) => d !== dia) : [...prev.diasSel, dia],
    }));
  }

  async function handleSubmit() {
    setErro(null);
    setEnviando(true);
    try {
      await pontosApi.criar({
        nome: f.nome,
        endereco: {
          cep: f.cep,
          numero: f.numero,
          rua: f.logradouro,
          bairro: f.bairro,
          cidade: f.cidade,
          uf: f.uf,
          ...coordenadaAleatoriaBauru(),
        },
        horario_funcionamento: formatHorarioFuncionamento(f.diasSel, f.horarioAbertura, f.horarioFechamento),
        capacidade_total: Number(f.capacidade) || 1,
      });
      setStep(4);
    } catch {
      setErro("Não foi possível cadastrar o ponto. Confira os dados e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (step === 1) {
    return (
      <Step1DadosPonto
        nome={f.nome}
        onChangeNome={(nome) => setF((p) => ({ ...p, nome }))}
        onNext={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return (
      <Step2Endereco
        endereco={f}
        onChange={(field, value) => setF((p) => ({ ...p, [field]: value }))}
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      />
    );
  }

  if (step === 3) {
    return (
      <Step3HorariosCapacidade
        capacidade={f.capacidade}
        horarioAbertura={f.horarioAbertura}
        horarioFechamento={f.horarioFechamento}
        diasSel={f.diasSel}
        onChangeCapacidade={(capacidade) => setF((p) => ({ ...p, capacidade }))}
        onChangeAbertura={(horarioAbertura) => setF((p) => ({ ...p, horarioAbertura }))}
        onChangeFechamento={(horarioFechamento) => setF((p) => ({ ...p, horarioFechamento }))}
        onToggleDia={toggleDia}
        onBack={() => setStep(2)}
        onSubmit={handleSubmit}
        enviando={enviando}
        erro={erro}
      />
    );
  }

  return <Sucesso />;
}
