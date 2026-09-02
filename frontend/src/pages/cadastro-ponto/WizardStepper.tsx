import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS = ["Dados do ponto", "Endereço", "Horários e capacidade"];

export function WizardStepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-6 flex items-center gap-2.5">
      {[1, 2, 3].map((n, idx) => {
        const done = n < step;
        const atual = n === step;
        return (
          <div key={n} className="flex items-center gap-2.5">
            <div
              className={cn(
                "font-display flex h-[26px] w-[26px] items-center justify-center rounded-full text-xs font-bold",
                done && "bg-success-bg text-success",
                atual && "bg-primary text-primary-foreground",
                !done && !atual && "border border-input bg-muted text-muted-foreground"
              )}
            >
              {done ? <Check size={13} strokeWidth={3} /> : n}
            </div>
            {idx < 2 && <div className={cn("h-0.5 w-10", n < step ? "bg-primary" : "bg-border")} />}
          </div>
        );
      })}
      <span className="ml-2 text-[12.5px] text-muted-foreground">{LABELS[step - 1]}</span>
    </div>
  );
}
