import { Building2, LogOut, MapPin, Package, Route } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `p2g-navlink${isActive ? " active" : ""}`;

export function TopNav() {
  const { usuario, logout } = useAuth();
  const inicial = usuario?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: 68,
        background: "#fff",
        borderBottom: "1px solid #E3E8F1",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "stretch",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 9 }}>
          <img src="/point2go-pin.png" alt="" style={{ width: 25, height: 25, display: "block" }} />
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontWeight: 700,
              fontSize: 16.5,
              color: "#0B1233",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Point2Go
          </span>
        </div>

        <nav style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, height: "100%" }}>
          <NavLink to="/mapa" className={linkClass}>
            <MapPin size={15} />
            Mapa de pontos
          </NavLink>
          <NavLink to="/encomendas" className={linkClass}>
            <Package size={15} />
            Minhas encomendas
          </NavLink>
          <NavLink to="/rastreio" className={linkClass}>
            <Route size={15} />
            Rastreio
          </NavLink>
          {usuario?.tipo === "parceiro" && (
            <NavLink to="/parceiro/novo-ponto" className={linkClass}>
              <Building2 size={15} />
              Cadastrar ponto
            </NavLink>
          )}
        </nav>

        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={logout} title="Sair" className="p2g-link-muted" style={{ display: "flex", alignItems: "center" }}>
            <LogOut size={15} />
          </button>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#0B1233",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Sora, sans-serif",
              fontWeight: 700,
              fontSize: 12.5,
              flexShrink: 0,
            }}
          >
            {inicial}
          </div>
        </div>
      </div>
    </header>
  );
}
