import { Button } from "@/components/common/Button";
import { WizardStepper } from "./WizardStepper";

type Endereco = { cep: string; numero: string; logradouro: string; bairro: string; cidade: string; uf: string };

type Props = {
  endereco: Endereco;
  onChange: (field: keyof Endereco, value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

export function Step2Endereco({ endereco, onChange, onBack, onNext }: Props) {
  const preenchido = endereco.cep && endereco.numero && endereco.logradouro && endereco.bairro && endereco.cidade && endereco.uf;

  return (
    <div style={{ padding: "40px 24px", boxSizing: "border-box", maxWidth: 640, margin: "0 auto" }}>
      <WizardStepper step={2} />
      <div className="p2g-card" style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Campo label="CEP">
            <input required value={endereco.cep} onChange={(e) => onChange("cep", e.target.value)} className="p2g-input" style={{ height: 40 }} />
          </Campo>
          <Campo label="Número">
            <input required value={endereco.numero} onChange={(e) => onChange("numero", e.target.value)} className="p2g-input" style={{ height: 40 }} />
          </Campo>
          <div style={{ gridColumn: "span 2" }}>
            <Campo label="Logradouro">
              <input required value={endereco.logradouro} onChange={(e) => onChange("logradouro", e.target.value)} className="p2g-input" style={{ height: 40 }} />
            </Campo>
          </div>
          <Campo label="Bairro">
            <input required value={endereco.bairro} onChange={(e) => onChange("bairro", e.target.value)} className="p2g-input" style={{ height: 40 }} />
          </Campo>
          <Campo label="Cidade">
            <input required value={endereco.cidade} onChange={(e) => onChange("cidade", e.target.value)} className="p2g-input" style={{ height: 40 }} />
          </Campo>
          <Campo label="UF">
            <input
              required
              maxLength={2}
              value={endereco.uf}
              onChange={(e) => onChange("uf", e.target.value.toUpperCase())}
              className="p2g-input"
              style={{ height: 40, textTransform: "uppercase" }}
            />
          </Campo>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <Button variant="outline" onClick={onBack} style={{ height: 40, padding: "0 18px" }}>
            Voltar
          </Button>
          <Button onClick={onNext} disabled={!preenchido} style={{ height: 40 }}>
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
