import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Sucesso() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto box-border max-w-[520px] px-6 py-10">
      <Card className="px-8 py-10 text-center">
        <CardContent>
          <div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-success-bg text-success">
            <Check size={26} />
          </div>
          <h2 className="font-display m-0 mb-2 text-lg font-bold text-foreground">Ponto cadastrado</h2>
          <p className="m-0 mb-6 text-[13.5px] text-muted-foreground">
            Seu ponto já aparece no mapa para os clientes da região.
          </p>
          <Button onClick={() => navigate("/mapa")}>Ver no mapa</Button>
        </CardContent>
      </Card>
    </div>
  );
}
