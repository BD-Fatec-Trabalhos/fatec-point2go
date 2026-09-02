import { Check } from "lucide-react";

const LABELS = ["Dados do ponto", "Endereço", "Horários e capacidade"];

export function WizardStepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
      {[1, 2, 3].map((n, idx) => {
        const done = n < step;
        const atual = n === step;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Sora, sans-serif",
                background: done ? "#DCFCE7" : atual ? "#1D4ED8" : "#F1F5F9",
                color: done ? "#15803D" : atual ? "#fff" : "#94A3B8",
                border: !done && !atual ? "1px solid #E2E8F0" : undefined,
              }}
            >
              {done ? <Check size={13} strokeWidth={3} /> : n}
            </div>
            {idx < 2 && <div style={{ height: 2, width: 40, background: n < step ? "#1D4ED8" : "#E2E8F0" }} />}
          </div>
        );
      })}
      <span style={{ fontSize: 12.5, color: "#64748B", marginLeft: 8 }}>{LABELS[step - 1]}</span>
    </div>
  );
}
