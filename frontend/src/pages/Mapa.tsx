import { ArrowLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PontosMap } from "@/components/map/PontosMap";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usePontos } from "@/hooks/usePontos";
import type { PontoRetirada } from "@/types";

function ocupacaoInfo(p: PontoRetirada) {
  const pct = p.capacidade_total > 0 ? Math.round((p.capacidade_ocupada / p.capacidade_total) * 100) : 100;
  const pctCapped = Math.min(pct, 100);
  const lotado = p.capacidade_ocupada >= p.capacidade_total;
  return {
    pctCapped,
    lotado,
    disponivel: p.ativo && !lotado,
    barClass: pct >= 100 ? "bg-destructive" : pct > 75 ? "bg-warning" : "bg-gradient-to-r from-primary to-secondary",
  };
}

export function Mapa() {
  const { pontos, carregando, erro } = usePontos();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const pontosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();
    if (!termo) return pontos;
    return pontos.filter(
      (p) => p.nome.toLowerCase().includes(termo) || p.endereco.bairro.toLowerCase().includes(termo)
    );
  }, [pontos, search]);

  const selecionado = pontos.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="relative h-[calc(100vh-68px)] w-full overflow-hidden">
      <PontosMap pontos={pontosFiltrados} selectedId={selectedId} onSelect={setSelectedId} />

      <div className="shadow-panel absolute inset-y-0 left-0 z-[5] flex w-[380px] flex-col overflow-hidden border-r border-border-card bg-card">
        {!selecionado ? (
          <>
            <div className="flex-shrink-0 border-b border-[#EEF1F6] px-[18px] pb-3 pt-[18px]">
              <p className="font-display m-0 mb-2.5 text-[15px] font-bold text-foreground">Pontos de retirada</p>
              <div className="relative">
                <span className="pointer-events-none absolute left-2.5 top-1/2 flex -translate-y-1/2 text-muted-foreground">
                  <Search size={14} />
                </span>
                <Input
                  placeholder="Buscar por nome ou bairro"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-[38px] pl-8 text-[13px]"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5">
              {carregando && <p className="m-0 px-2 py-6 text-center text-[13px] text-muted-foreground">Carregando...</p>}
              {erro && <p className="m-0 px-2 py-6 text-center text-[13px] text-destructive">{erro}</p>}
              {!carregando &&
                !erro &&
                pontosFiltrados.map((p) => {
                  const { disponivel } = ocupacaoInfo(p);
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className="mb-1 cursor-pointer rounded-xl p-3 hover:bg-accent"
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="m-0 text-[13.5px] font-semibold text-foreground">{p.nome}</p>
                        <span
                          className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${disponivel ? "bg-secondary" : "bg-destructive"}`}
                        />
                      </div>
                      <p className="m-0 text-xs text-muted-foreground">
                        {p.endereco.bairro}, {p.endereco.cidade}/{p.endereco.uf}
                      </p>
                    </div>
                  );
                })}
              {!carregando && !erro && pontosFiltrados.length === 0 && (
                <p className="m-0 px-2 py-6 text-center text-[13px] text-muted-foreground">Nenhum ponto encontrado.</p>
              )}
            </div>
          </>
        ) : (
          <div className="overflow-y-auto px-[18px] py-4">
            <button
              onClick={() => setSelectedId(null)}
              className="mb-3.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={13} />
              Voltar à lista
            </button>

            {(() => {
              const { pctCapped, lotado, disponivel, barClass } = ocupacaoInfo(selecionado);
              return (
                <>
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="font-display m-0 text-base font-bold text-foreground">{selecionado.nome}</p>
                    <Badge variant={disponivel ? "success" : "destructive"}>
                      {disponivel ? "Disponível" : "Lotado"}
                    </Badge>
                  </div>

                  <p className="m-0 mb-4 text-[13.5px] leading-relaxed text-[#475569]">
                    {selecionado.endereco.rua}, {selecionado.endereco.numero} — {selecionado.endereco.bairro},{" "}
                    {selecionado.endereco.cidade}/{selecionado.endereco.uf}
                  </p>

                  <div className="mb-1.5 flex justify-between text-[11.5px] text-muted-foreground">
                    <span>Ocupação</span>
                    <span className="font-mono">
                      {selecionado.capacidade_ocupada}/{selecionado.capacidade_total}
                    </span>
                  </div>
                  <div className="mb-4 h-[7px] overflow-hidden rounded-full bg-[#EEF1F6]">
                    <div className={`h-full ${barClass}`} style={{ width: `${pctCapped}%` }} />
                  </div>

                  <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                    {selecionado.horario_funcionamento}
                  </div>
                  {lotado && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Este ponto está com a capacidade máxima no momento.
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
