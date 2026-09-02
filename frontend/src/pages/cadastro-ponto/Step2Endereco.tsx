import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WizardStepper } from "./WizardStepper";

type Endereco = { cep: string; numero: string; logradouro: string; bairro: string; cidade: string; uf: string };

type Props = {
  endereco: Endereco;
  onChange: (field: keyof Endereco, value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function Step2Endereco({ endereco, onChange, onBack, onNext }: Props) {
  const preenchido = endereco.cep && endereco.numero && endereco.logradouro && endereco.bairro && endereco.cidade && endereco.uf;

  return (
    <div className="mx-auto box-border max-w-[640px] px-6 py-10">
      <WizardStepper step={2} />
      <Card className="p-7">
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" required value={endereco.cep} onChange={(e) => onChange("cep", e.target.value)} className="h-10" />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" required value={endereco.numero} onChange={(e) => onChange("numero", e.target.value)} className="h-10" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input
                id="logradouro"
                required
                value={endereco.logradouro}
                onChange={(e) => onChange("logradouro", e.target.value)}
                className="h-10"
              />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" required value={endereco.bairro} onChange={(e) => onChange("bairro", e.target.value)} className="h-10" />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" required value={endereco.cidade} onChange={(e) => onChange("cidade", e.target.value)} className="h-10" />
            </div>
            <div>
              <Label htmlFor="uf">UF</Label>
              <Input
                id="uf"
                required
                maxLength={2}
                value={endereco.uf}
                onChange={(e) => onChange("uf", e.target.value.toUpperCase())}
                className="h-10 uppercase"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={onBack} className="h-10 px-4">
              Voltar
            </Button>
            <Button onClick={onNext} disabled={!preenchido} className="h-10">
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
