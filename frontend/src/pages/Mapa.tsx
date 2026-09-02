import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PontosMap } from "@/components/map/PontosMap";
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
    barColor: pct >= 100 ? "#DC2626" : pct > 75 ? "#F59E0B" : undefined,
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
    <div style={{ position: "relative", height: "calc(100vh - 68px)", width: "100%", overflow: "hidden" }}>
      <PontosMap pontos={pontosFiltrados} selectedId={selectedId} onSelect={setSelectedId} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 380,
          background: "#fff",
          borderRight: "1px solid #E3E8F1",
          boxShadow: "8px 0 28px -16px rgba(11,18,51,0.25)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {!selecionado ? (
          <>
            <div style={{ padding: "18px 18px 12px", borderBottom: "1px solid #EEF1F6", flexShrink: 0 }}>
              <p style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700, color: "#101828", margin: "0 0 10px" }}>
                Pontos de retirada
              </p>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex", pointerEvents: "none" }}>
                  <Search size={14} />
                </span>
                <input
                  placeholder="Buscar por nome ou bairro"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p2g-input"
                  style={{ height: 38, padding: "0 12px 0 32px", fontSize: 13 }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              {carregando && (
                <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, padding: "24px 8px", margin: 0 }}>Carregando...</p>
              )}
              {erro && (
                <p style={{ textAlign: "center", color: "#B91C1C", fontSize: 13, padding: "24px 8px", margin: 0 }}>{erro}</p>
              )}
              {!carregando && !erro && pontosFiltrados.map((p) => {
                const { disponivel } = ocupacaoInfo(p);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className="p2g-row-hover"
                    style={{ padding: 12, borderRadius: 12, cursor: "pointer", marginBottom: 4 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: "#101828", margin: 0 }}>{p.nome}</p>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: disponivel ? "#38BDF8" : "#DC2626",
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
                      {p.endereco.bairro}, {p.endereco.cidade}/{p.endereco.uf}
                    </p>
                  </div>
                );
              })}
              {!carregando && !erro && pontosFiltrados.length === 0 && (
                <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, padding: "24px 8px", margin: 0 }}>
                  Nenhum ponto encontrado.
                </p>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: "16px 18px", overflowY: "auto" }}>
            <button
              onClick={() => setSelectedId(null)}
              className="p2g-link-muted"
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, marginBottom: 14 }}
            >
              ← Voltar à lista
            </button>

            {(() => {
              const { pctCapped, lotado, disponivel, barColor } = ocupacaoInfo(selecionado);
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <p style={{ fontFamily: "Sora, sans-serif", fontSize: 16, fontWeight: 700, color: "#101828", margin: 0 }}>
                      {selecionado.nome}
                    </p>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 600,
                        background: disponivel ? "#DCFCE7" : "#FEE2E2",
                        color: disponivel ? "#15803D" : "#B91C1C",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {disponivel ? "Disponível" : "Lotado"}
                    </span>
                  </div>

                  <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.5, margin: "0 0 16px" }}>
                    {selecionado.endereco.rua}, {selecionado.endereco.numero} — {selecionado.endereco.bairro},{" "}
                    {selecionado.endereco.cidade}/{selecionado.endereco.uf}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#94A3B8", marginBottom: 5 }}>
                    <span>Ocupação</span>
                    <span style={{ fontFamily: "ui-monospace, monospace" }}>
                      {selecionado.capacidade_ocupada}/{selecionado.capacidade_total}
                    </span>
                  </div>
                  <div style={{ height: 7, borderRadius: 99, background: "#EEF1F6", overflow: "hidden", marginBottom: 16 }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pctCapped}%`,
                        background: barColor ?? "linear-gradient(90deg,#1D4ED8,#38BDF8)",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#94A3B8" }}>
                    {selecionado.horario_funcionamento}
                  </div>
                  {lotado && (
                    <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 16 }}>
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
