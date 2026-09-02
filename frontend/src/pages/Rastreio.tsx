import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { useEncomendas } from "@/hooks/useEncomendas";
import { usePontos } from "@/hooks/usePontos";
import { encomendasApi } from "@/lib/api/encomendas";
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
    <div style={{ padding: "40px 24px", boxSizing: "border-box", maxWidth: 760, margin: "0 auto" }}>
      <div className="p2g-card" style={{ padding: 22, marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          placeholder="Digite o código de rastreio"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="p2g-input"
          style={{ flex: 1, fontFamily: "ui-monospace, monospace" }}
        />
        <Button onClick={() => codigo.trim() && rastrear(codigo.trim())} disabled={carregando} style={{ flexShrink: 0 }}>
          Rastrear
        </Button>
      </div>

      {!buscado && (
        <>
          <p style={{ fontSize: 12.5, color: "#94A3B8", margin: "0 0 10px" }}>Suas encomendas recentes</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {encomendas.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setCodigo(e.codigo_rastreio);
                  rastrear(e.codigo_rastreio);
                }}
                className="p2g-row-hover"
                style={{
                  height: 32,
                  padding: "0 14px",
                  border: "1px solid #E2E8F0",
                  borderRadius: 99,
                  background: "#fff",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 12,
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                {e.codigo_rastreio}
              </button>
            ))}
          </div>
        </>
      )}

      {naoEncontrada && (
        <div className="p2g-card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ fontSize: 13.5, color: "#94A3B8", margin: 0 }}>Não encontramos nenhuma encomenda com esse código.</p>
        </div>
      )}

      {resultado && (
        <div className="p2g-card" style={{ padding: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 12 }}>
            <div>
              <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 12.5, color: "#94A3B8", margin: "0 0 4px" }}>
                {resultado.codigo_rastreio}
              </p>
              <p style={{ fontFamily: "Sora, sans-serif", fontSize: 16, fontWeight: 700, color: "#101828", margin: 0 }}>
                {resultado.ponto ? pontosPorId[resultado.ponto]?.nome ?? "—" : "—"}
              </p>
            </div>
          </div>

          {isDevolvido ? (
            <div style={{ background: "#FEE2E2", borderRadius: 10, padding: "14px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626", flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#B91C1C" }}>Devolvido ao remetente</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 26 }}>
              {STATUS_ORDER.map((status, idx) => {
                const done = idx <= currentIdx;
                const hasLine = idx < STATUS_ORDER.length - 1;
                const lineDone = idx < currentIdx;
                return (
                  <div key={status} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, width: 84 }}>
                      {done ? (
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1D4ED8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Check size={14} strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F1F5F9", border: "2px solid #E2E8F0", flexShrink: 0 }} />
                      )}
                      <p style={{ fontSize: 11, textAlign: "center", lineHeight: 1.3, margin: 0, color: "#64748B", fontWeight: 600 }}>
                        {STATUS_INFO[status].label}
                      </p>
                    </div>
                    {hasLine && (
                      <div style={{ flex: 1, height: 2, margin: "0 -4px 22px", background: lineDone ? "#1D4ED8" : "#E2E8F0" }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 12px" }}>
            Histórico
          </p>
          <div style={{ position: "relative", paddingLeft: 18, borderLeft: "1px solid #E3E8F1", display: "flex", flexDirection: "column", gap: 16 }}>
            {resultado.movimentacoes.map((m) => (
              <div key={m.id} style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: -23, top: 3, width: 9, height: 9, borderRadius: "50%", background: "#1D4ED8", border: "2px solid #fff", boxShadow: "0 0 0 1px #E3E8F1" }} />
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "#101828", margin: "0 0 2px" }}>{m.descricao}</p>
                <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11.5, color: "#94A3B8", margin: 0 }}>
                  {formatData(m.data_hora)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
