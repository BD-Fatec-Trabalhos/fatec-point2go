import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="mx-auto box-border max-w-[640px] px-6 py-10">
      <WizardStepper step={3} />
      <Card className="p-7">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="capacidade">Capacidade (nº de encomendas)</Label>
              <Input
                id="capacidade"
                type="number"
                min={1}
                required
                value={capacidade}
                onChange={(e) => onChangeCapacidade(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="abertura">Abertura</Label>
                <Input
                  id="abertura"
                  type="time"
                  required
                  value={horarioAbertura}
                  onChange={(e) => onChangeAbertura(e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Label htmlFor="fechamento">Fechamento</Label>
                <Input
                  id="fechamento"
                  type="time"
                  required
                  value={horarioFechamento}
                  onChange={(e) => onChangeFechamento(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
            <div className="mb-6">
              <Label>Dias de funcionamento</Label>
              <div className="flex flex-wrap gap-2">
                {DIAS.map((d) => (
                  <Button
                    key={d.value}
                    type="button"
                    size="sm"
                    variant={diasSel.includes(d.value) ? "default" : "outline"}
                    onClick={() => onToggleDia(d.value)}
                    className="rounded-lg"
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
            </div>

            {erro && (
              <p className="mb-4 rounded-lg bg-destructive-bg px-3.5 py-2.5 text-sm text-destructive">{erro}</p>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack} className="h-10 px-4">
                Voltar
              </Button>
              <Button type="submit" disabled={enviando || diasSel.length === 0} className="h-10">
                {enviando ? "Enviando..." : "Concluir cadastro"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
