import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WizardStepper } from "./WizardStepper";

type Props = {
  nome: string;
  onChangeNome: (v: string) => void;
  onNext: () => void;
};

export function Step1DadosPonto({ nome, onChangeNome, onNext }: Props) {
  return (
    <div className="mx-auto box-border max-w-[640px] px-6 py-10">
      <WizardStepper step={1} />
      <Card className="p-7">
        <CardContent>
          <div>
            <Label htmlFor="nome-ponto">Nome do ponto</Label>
            <Input id="nome-ponto" required value={nome} onChange={(e) => onChangeNome(e.target.value)} className="h-10" />
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={onNext} disabled={!nome.trim()} className="h-10">
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
