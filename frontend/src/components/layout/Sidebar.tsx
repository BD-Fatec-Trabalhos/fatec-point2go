import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, Building2, MapPin, PackageSearch, Route, Wifi, WifiOff } from "lucide-react";
import { api } from "@/lib/api";

const navItems = [
  { to: "/", label: "Início", icon: LayoutDashboard, end: true },
  { to: "/parceiros", label: "Parceiros", icon: Building2 },
  { to: "/pontos", label: "Pontos de retirada", icon: MapPin },
  { to: "/encomendas", label: "Encomendas", icon: PackageSearch },
  { to: "/movimentacoes", label: "Movimentações", icon: Route },
];

export function Sidebar() {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .get("/health/")
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-white">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
          <Route size={16} className="text-primary-foreground" />
        </div>
        <span className="font-display font-semibold text-foreground tracking-tight">PUDOs</span>
      </div>

      {/* nav com "linha de rota" conectando os pontos do menu, remetendo ao
          trajeto de uma encomenda entre pontos de retirada */}
      <nav className="relative flex-1 px-3 py-6">
        <div className="absolute left-[27px] top-6 bottom-6 w-px bg-border" aria-hidden />
        <ul className="space-y-1 relative">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to} className="relative">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-white"
                      }`}
                    >
                      <Icon size={13} />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {apiOnline === null && <span>Verificando backend...</span>}
          {apiOnline === true && (
            <>
              <Wifi size={14} className="text-success" /> Backend conectado
            </>
          )}
          {apiOnline === false && (
            <>
              <WifiOff size={14} className="text-danger" /> Backend offline (usando dados de exemplo)
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
