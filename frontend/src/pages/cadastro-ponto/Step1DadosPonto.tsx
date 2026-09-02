import { Button } from "@/components/common/Button";
import { WizardStepper } from "./WizardStepper";

type Props = {
  nome: string;
  onChangeNome: (v: string) => void;
  onNext: () => void;
};

export function Step1DadosPonto({ nome, onChangeNome, onNext }: Props) {
  return (
    <div style={{ padding: "40px 24px", boxSizing: "border-box", maxWidth: 640, margin: "0 auto" }}>
      <WizardStepper step={1} />
      <div className="p2g-card" style={{ padding: 28 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
            Nome do ponto
          </label>
          <input
            required
            value={nome}
            onChange={(e) => onChangeNome(e.target.value)}
            className="p2g-input"
            style={{ height: 40 }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <Button onClick={onNext} disabled={!nome.trim()} style={{ height: 40 }}>
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
