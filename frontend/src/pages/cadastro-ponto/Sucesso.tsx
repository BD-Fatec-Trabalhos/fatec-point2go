import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";

export function Sucesso() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "40px 24px", boxSizing: "border-box", maxWidth: 520, margin: "0 auto" }}>
      <div className="p2g-card" style={{ padding: "40px 32px", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#DCFCE7",
            color: "#15803D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}
        >
          <Check size={26} />
        </div>
        <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 18, fontWeight: 700, color: "#101828", margin: "0 0 8px" }}>
          Ponto cadastrado
        </h2>
        <p style={{ fontSize: 13.5, color: "#64748B", margin: "0 0 24px" }}>
          Seu ponto já aparece no mapa para os clientes da região.
        </p>
        <Button onClick={() => navigate("/mapa")}>Ver no mapa</Button>
      </div>
    </div>
  );
}
