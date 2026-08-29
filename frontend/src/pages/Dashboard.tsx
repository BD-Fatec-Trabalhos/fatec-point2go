import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppData } from "@/context/AppDataContext";
import { STATUS_LABEL, MOVIMENTACAO_LABEL } from "@/types";
import { Building2, MapPin, PackageSearch, PackageCheck } from "lucide-react";

export function Dashboard() {
  const { parceiros, pontos, encomendas, movimentacoes } = useAppData();

  const disponiveis = pontos.filter((p) => p.disponivel).length;
  const aguardandoRetirada = encomendas.filter((e) => e.status === "disponivel_para_retirada").length;
  const retiradas = encomendas.filter((e) => e.status === "retirada").length;

  const ultimasMovimentacoes = [...movimentacoes]
    .sort((a, b) => (a.dataHora < b.dataHora ? 1 : -1))
    .slice(0, 5);

  const stats = [
    { label: "Parceiros ativos", value: parceiros.filter((p) => p.ativo).length, icon: Building2 },
    { label: "Pontos disponíveis", value: `${disponiveis}/${pontos.length}`, icon: MapPin },
    { label: "Aguardando retirada", value: aguardandoRetirada, icon: PackageSearch },
    { label: "Retiradas concluídas", value: retiradas, icon: PackageCheck },
  ];

  return (
    <AppLayout title="Início" subtitle="Visão geral da operação">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-5 flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
              </div>
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={18} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ocupação dos pontos de retirada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pontos.map((ponto) => {
              const pct = Math.round((ponto.ocupacaoAtual / ponto.capacidade) * 100);
              return (
                <div key={ponto.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{ponto.nome}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {ponto.ocupacaoAtual}/{ponto.capacidade}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 100 ? "bg-danger" : pct > 75 ? "bg-accent" : "bg-primary"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-border ml-2 space-y-5">
              {ultimasMovimentacoes.map((mov) => {
                const encomenda = encomendas.find((e) => e.id === mov.encomendaId);
                return (
                  <li key={mov.id} className="ml-4">
                    <div className="absolute -ml-[21px] mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <p className="text-sm text-foreground font-medium">{MOVIMENTACAO_LABEL[mov.tipo]}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {encomenda?.codigoRastreio} · {new Date(mov.dataHora).toLocaleString("pt-BR")}
                    </p>
                    {encomenda && (
                      <Badge variant="info" className="mt-1">
                        {STATUS_LABEL[encomenda.status]}
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
