import { Building2, LogOut, MapPin, Package, Route } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex h-full items-center gap-1.5 border-b-2 border-transparent px-0.5 text-[13.5px]",
    isActive ? "border-primary font-semibold text-primary" : "font-medium text-muted-foreground hover:text-foreground"
  );

export function TopNav() {
  const { usuario, logout } = useAuth();
  const inicial = usuario?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 box-border h-[68px] border-b border-border-card bg-card">
      <div className="box-border flex h-full w-full items-stretch px-6">
        <div className="flex flex-shrink-0 items-center gap-2.5">
          <img src="/point2go-pin.png" alt="" className="block h-[25px] w-[25px]" />
          <span className="font-display whitespace-nowrap text-[16.5px] font-bold tracking-tight text-[#0B1233]">
            Point2Go
          </span>
        </div>

        <nav className="flex h-full flex-1 items-center justify-center gap-6">
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

        <div className="flex flex-shrink-0 items-center gap-4">
          <button onClick={logout} title="Sair" className="flex items-center text-muted-foreground hover:text-destructive">
            <LogOut size={15} />
          </button>
          <div className="font-display flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-[#0B1233] text-[12.5px] font-bold text-white">
            {inicial}
          </div>
        </div>
      </div>
    </header>
  );
}
