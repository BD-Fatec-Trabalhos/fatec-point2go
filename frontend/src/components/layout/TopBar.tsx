import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { usuario, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-white/90 backdrop-blur px-6">
      <div>
        <h1 className="font-display text-lg font-semibold text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {usuario && (
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-foreground">{usuario.nome}</p>
            <p className="text-xs text-muted-foreground capitalize">{usuario.perfil}</p>
          </div>
          <button
            onClick={logout}
            title="Sair"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
