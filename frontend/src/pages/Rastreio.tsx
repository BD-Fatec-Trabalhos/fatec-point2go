import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEncomendas } from "@/hooks/useEncomendas";
import { usePontos } from "@/hooks/usePontos";
import { encomendasApi } from "@/lib/api/encomendas";
import { cn } from "@/lib/utils";
import { STATUS_INFO, STATUS_ORDER } from "@/lib/status";
import type { EncomendaRastreio } from "@/types";

function formatData(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export function Rastreio() {
  const [searchParams] = useSearchParams();
  const { encomendas } = useEncomendas();
  const { pontos } = usePontos();
  const pontosPorId = useMemo(() => Object.fromEntries(pontos.map((p) => [p.id, p])), [pontos]);

  const [codigo, setCodigo] = useState(searchParams.get("codigo") ?? "");
  const [resultado, setResultado] = useState<EncomendaRastreio | null>(null);
  const [naoEncontrada, setNaoEncontrada] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function rastrear(codigoBusca: string) {
    setCarregando(true);
    setNaoEncontrada(false);
    setResultado(null);
    try {
      const enc = await encomendasApi.rastrear(codigoBusca);
      setResultado(enc);
    } catch {
      setNaoEncontrada(true);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const codigoInicial = searchParams.get("codigo");
    if (codigoInicial) rastrear(codigoInicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscado = resultado !== null || naoEncontrada;
  const isDevolvido = resultado?.status_atual === "devolvido";
  const currentIdx = resultado ? STATUS_ORDER.indexOf(resultado.status_atual) : -1;

  return (
    <div className="mx-auto box-border max-w-[760px] px-6 py-10">
      <Card className="mb-5 flex gap-2.5 p-5">
        <Input
          placeholder="Digite o código de rastreio"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="flex-1 font-mono"
        />
        <Button onClick={() => codigo.trim() && rastrear(codigo.trim())} disabled={carregando} className="flex-shrink-0">
          Rastrear
        </Button>
      </Card>

      {!buscado && (
        <>
          <p className="mb-2.5 text-[12.5px] text-muted-foreground">Suas encomendas recentes</p>
          <div className="flex flex-wrap gap-2">
            {encomendas.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setCodigo(e.codigo_rastreio);
                  rastrear(e.codigo_rastreio);
                }}
                className="h-8 cursor-pointer rounded-full border border-input bg-card px-3.5 font-mono text-xs text-[#475569] hover:bg-accent"
              >
                {e.codigo_rastreio}
              </button>
            ))}
          </div>
        </>
      )}

      {naoEncontrada && (
        <Card className="p-8 text-center">
          <p className="m-0 text-[13.5px] text-muted-foreground">Não encontramos nenhuma encomenda com esse código.</p>
        </Card>
      )}

      {resultado && (
        <Card className="p-[26px]">
          <div className="mb-[22px] flex items-start justify-between gap-3">
            <div>
              <p className="m-0 mb-1 font-mono text-[12.5px] text-muted-foreground">{resultado.codigo_rastreio}</p>
              <p className="font-display m-0 text-base font-bold text-foreground">
                {resultado.ponto ? pontosPorId[resultado.ponto]?.nome ?? "—" : "—"}
              </p>
            </div>
          </div>

          {isDevolvido ? (
            <div className="mb-6 flex items-center gap-2.5 rounded-[10px] bg-destructive-bg px-4 py-3.5">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-destructive" />
              <span className="text-[13.5px] font-semibold text-destructive">Devolvido ao remetente</span>
            </div>
          ) : (
            <div className="mb-[26px] flex items-center">
              {STATUS_ORDER.map((status, idx) => {
                const done = idx <= currentIdx;
                const hasLine = idx < STATUS_ORDER.length - 1;
                const lineDone = idx < currentIdx;
                return (
                  <div key={status} className="flex flex-1 items-center">
                    <div className="flex w-[84px] flex-shrink-0 flex-col items-center gap-2">
                      {done ? (
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check size={14} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="h-7 w-7 flex-shrink-0 rounded-full border-2 border-input bg-muted" />
                      )}
                      <p className="m-0 text-center text-[11px] font-semibold leading-tight text-[#64748B]">
                        {STATUS_INFO[status].label}
                      </p>
                    </div>
                    {hasLine && (
                      <div className={cn("mx-[-4px] mb-[22px] h-0.5 flex-1", lineDone ? "bg-primary" : "bg-border")} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="m-0 mb-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Histórico</p>
          <div className="relative flex flex-col gap-4 border-l border-border-card pl-[18px]">
            {resultado.movimentacoes.map((m) => (
              <div key={m.id} className="relative">
                <span className="absolute -left-[23px] top-[3px] h-2.5 w-2.5 rounded-full border-2 border-card bg-primary shadow-[0_0_0_1px_var(--border-card)]" />
                <p className="m-0 mb-0.5 text-[13.5px] font-semibold text-foreground">{m.descricao}</p>
                <p className="m-0 font-mono text-[11.5px] text-muted-foreground">{formatData(m.data_hora)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
