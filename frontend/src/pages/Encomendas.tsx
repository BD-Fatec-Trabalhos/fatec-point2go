import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEncomendas } from "@/hooks/useEncomendas";
import { usePontos } from "@/hooks/usePontos";
import { STATUS_INFO } from "@/lib/status";
import type { StatusEncomenda } from "@/types";

function formatData(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

const BADGE_VARIANT: Record<StatusEncomenda, "neutral" | "info" | "warning" | "success" | "destructive"> = {
  em_transito: "neutral",
  aguardando_retirada: "warning",
  retirada_confirmada: "success",
  devolvido: "destructive",
};

export function Encomendas() {
  const { encomendas, carregando, erro } = useEncomendas();
  const { pontos } = usePontos();
  const [statusFilter, setStatusFilter] = useState<StatusEncomenda | "todos">("todos");
  const navigate = useNavigate();

  const pontosPorId = useMemo(() => Object.fromEntries(pontos.map((p) => [p.id, p])), [pontos]);

  const encomendasFiltradas = encomendas.filter(
    (e) => statusFilter === "todos" || e.status_atual === statusFilter
  );

  return (
    <div className="mx-auto box-border max-w-[760px] px-6 py-10">
      <div className="mb-[18px] flex gap-2.5">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusEncomenda | "todos")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {Object.entries(STATUS_INFO).map(([value, info]) => (
              <SelectItem key={value} value={value}>
                {info.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        {carregando && <p className="py-10 text-center text-[13.5px] text-muted-foreground">Carregando...</p>}
        {erro && <p className="py-10 text-center text-[13.5px] text-destructive">{erro}</p>}

        {!carregando &&
          !erro &&
          encomendasFiltradas.map((enc) => (
            <Card key={enc.id} className="flex items-center justify-between gap-4 px-5 py-[18px]">
              <div>
                <p className="m-0 mb-1 font-mono text-[13px] text-[#475569]">{enc.codigo_rastreio}</p>
                <p className="m-0 mb-0.5 text-[13.5px] font-semibold text-foreground">
                  {enc.ponto ? pontosPorId[enc.ponto]?.nome ?? "—" : "—"}
                </p>
                <p className="m-0 text-xs text-muted-foreground">Criada em {formatData(enc.data_criacao)}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3.5">
                <Badge variant={BADGE_VARIANT[enc.status_atual]}>{STATUS_INFO[enc.status_atual].label}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/rastreio?codigo=${encodeURIComponent(enc.codigo_rastreio)}`)}
                >
                  Ver rastreio
                </Button>
              </div>
            </Card>
          ))}

        {!carregando && !erro && encomendasFiltradas.length === 0 && (
          <p className="m-0 py-10 text-center text-[13.5px] text-muted-foreground">Nenhuma encomenda encontrada.</p>
        )}
      </div>
    </div>
  );
}
