import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAppData } from "@/context/AppDataContext";
import type { DiaSemana, PontoRetirada } from "@/types";

const DIAS: { value: DiaSemana; label: string }[] = [
  { value: "seg", label: "Seg" },
  { value: "ter", label: "Ter" },
  { value: "qua", label: "Qua" },
  { value: "qui", label: "Qui" },
  { value: "sex", label: "Sex" },
  { value: "sab", label: "Sáb" },
  { value: "dom", label: "Dom" },
];

const vazio = {
  nome: "",
  parceiroId: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
  capacidade: "50",
  horarioAbertura: "08:00",
  horarioFechamento: "18:00",
};

export function Pontos() {
  const { pontos, parceiros, addPonto } = useAppData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(vazio);
  const [dias, setDias] = useState<DiaSemana[]>(["seg", "ter", "qua", "qui", "sex"]);

  function set<K extends keyof typeof vazio>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDia(dia: DiaSemana) {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const novo: PontoRetirada = {
      id: `pt${Date.now()}`,
      nome: form.nome,
      parceiroId: form.parceiroId,
      endereco: {
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf,
      },
      capacidade: Number(form.capacidade),
      ocupacaoAtual: 0,
      horarioAbertura: form.horarioAbertura,
      horarioFechamento: form.horarioFechamento,
      diasFuncionamento: dias,
      disponivel: true,
    };
    addPonto(novo);
    setForm(vazio);
    setDias(["seg", "ter", "qua", "qui", "sex"]);
    setOpen(false);
  }

  return (
    <AppLayout title="Pontos de retirada" subtitle="Locais cadastrados para recebimento de encomendas">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> Novo ponto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pontos.map((ponto) => {
          const parceiro = parceiros.find((p) => p.id === ponto.parceiroId);
          const pct = Math.round((ponto.ocupacaoAtual / ponto.capacidade) * 100);
          return (
            <Card key={ponto.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-display font-semibold text-foreground">{ponto.nome}</p>
                    <p className="text-xs text-muted-foreground">{parceiro?.nomeFantasia ?? "Parceiro não encontrado"}</p>
                  </div>
                  <Badge variant={ponto.disponivel ? "success" : "danger"}>
                    {ponto.disponivel ? "Disponível" : "Lotado"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {ponto.endereco.logradouro}, {ponto.endereco.numero} — {ponto.endereco.bairro}, {ponto.endereco.cidade}/{ponto.endereco.uf}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Ocupação</span>
                  <span className="font-mono">{ponto.ocupacaoAtual}/{ponto.capacidade}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${pct >= 100 ? "bg-danger" : pct > 75 ? "bg-accent" : "bg-primary"}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {ponto.horarioAbertura} às {ponto.horarioFechamento} · {ponto.diasFuncionamento.map((d) => DIAS.find((x) => x.value === d)?.label).join(", ")}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Cadastrar ponto de retirada">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do ponto</Label>
            <Input id="nome" required value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="parceiroId">Parceiro responsável</Label>
            <Select id="parceiroId" required value={form.parceiroId} onChange={(e) => set("parceiroId", e.target.value)}>
              <option value="">Selecione...</option>
              {parceiros.map((p) => (
                <option key={p.id} value={p.id}>{p.nomeFantasia}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" required value={form.cep} onChange={(e) => set("cep", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" required value={form.numero} onChange={(e) => set("numero", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input id="logradouro" required value={form.logradouro} onChange={(e) => set("logradouro", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" required value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" required value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="uf">UF</Label>
              <Input id="uf" required maxLength={2} value={form.uf} onChange={(e) => set("uf", e.target.value.toUpperCase())} />
            </div>
            <div>
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input id="capacidade" type="number" min={1} required value={form.capacidade} onChange={(e) => set("capacidade", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="horarioAbertura">Abertura</Label>
              <Input id="horarioAbertura" type="time" required value={form.horarioAbertura} onChange={(e) => set("horarioAbertura", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="horarioFechamento">Fechamento</Label>
              <Input id="horarioFechamento" type="time" required value={form.horarioFechamento} onChange={(e) => set("horarioFechamento", e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Dias de funcionamento</Label>
            <div className="flex flex-wrap gap-2">
              {DIAS.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => toggleDia(d.value)}
                  className={`h-8 px-3 rounded-md text-xs font-medium border transition-colors ${
                    dias.includes(d.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar ponto</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
