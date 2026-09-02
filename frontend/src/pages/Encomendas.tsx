import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/common/StatusBadge";
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
    <div style={{ padding: "40px 24px", boxSizing: "border-box", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusEncomenda | "todos")}
          className="p2g-input"
          style={{ height: 40, minWidth: 220, width: "auto" }}
        >
          <option value="todos">Todos os status</option>
          {Object.entries(STATUS_INFO).map(([value, info]) => (
            <option key={value} value={value}>
              {info.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {carregando && <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 13.5, padding: "40px 0" }}>Carregando...</p>}
        {erro && <p style={{ textAlign: "center", color: "#B91C1C", fontSize: 13.5, padding: "40px 0" }}>{erro}</p>}

        {!carregando &&
          !erro &&
          encomendasFiltradas.map((enc) => (
            <div
              key={enc.id}
              className="p2g-card"
              style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
            >
              <div>
                <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#475569", margin: "0 0 4px" }}>
                  {enc.codigo_rastreio}
                </p>
                <p style={{ fontSize: 13.5, color: "#101828", fontWeight: 600, margin: "0 0 2px" }}>
                  {enc.ponto ? pontosPorId[enc.ponto]?.nome ?? "—" : "—"}
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Criada em {formatData(enc.data_criacao)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <StatusBadge status={enc.status_atual} />
                <button
                  onClick={() => navigate(`/rastreio?codigo=${encodeURIComponent(enc.codigo_rastreio)}`)}
                  className="p2g-btn p2g-btn-outline p2g-row-hover"
                  style={{ height: 36, padding: "0 14px", color: "#1D4ED8" }}
                >
                  Ver rastreio
                </button>
              </div>
            </div>
          ))}

        {!carregando && !erro && encomendasFiltradas.length === 0 && (
          <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 13.5, padding: "40px 0", margin: 0 }}>
            Nenhuma encomenda encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
