import type { FormEvent } from "react";
import { Button } from "@/components/common/Button";
import { DIAS } from "@/lib/horario";
import { WizardStepper } from "./WizardStepper";

type Props = {
  capacidade: string;
  horarioAbertura: string;
  horarioFechamento: string;
  diasSel: string[];
  onChangeCapacidade: (v: string) => void;
  onChangeAbertura: (v: string) => void;
  onChangeFechamento: (v: string) => void;
  onToggleDia: (dia: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  enviando: boolean;
  erro: string | null;
};

export function Step3HorariosCapacidade({
  capacidade,
  horarioAbertura,
  horarioFechamento,
  diasSel,
  onChangeCapacidade,
  onChangeAbertura,
  onChangeFechamento,
  onToggleDia,
  onBack,
  onSubmit,
  enviando,
  erro,
}: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div style={{ padding: "40px 24px", boxSizing: "border-box", maxWidth: 640, margin: "0 auto" }}>
      <WizardStepper step={3} />
      <div className="p2g-card" style={{ padding: 28 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
              Capacidade (nº de encomendas)
            </label>
            <input
              type="number"
              min={1}
              required
              value={capacidade}
              onChange={(e) => onChangeCapacidade(e.target.value)}
              className="p2g-input"
              style={{ height: 40 }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Abertura</label>
              <input type="time" required value={horarioAbertura} onChange={(e) => onChangeAbertura(e.target.value)} className="p2g-input" style={{ height: 40 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Fechamento</label>
              <input type="time" required value={horarioFechamento} onChange={(e) => onChangeFechamento(e.target.value)} className="p2g-input" style={{ height: 40 }} />
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
              Dias de funcionamento
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DIAS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => onToggleDia(d.value)}
                  className={`p2g-chip ${diasSel.includes(d.value) ? "p2g-chip-on" : "p2g-chip-off"}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {erro && (
            <p style={{ fontSize: 13, color: "#B91C1C", background: "#FEE2E2", borderRadius: 8, padding: "10px 12px", margin: "0 0 16px" }}>
              {erro}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="button" variant="outline" onClick={onBack} style={{ height: 40, padding: "0 18px" }}>
              Voltar
            </Button>
            <Button type="submit" disabled={enviando || diasSel.length === 0} style={{ height: 40 }}>
              {enviando ? "Enviando..." : "Concluir cadastro"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
