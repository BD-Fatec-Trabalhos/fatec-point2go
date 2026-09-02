import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function RequireParceiro({ children }: { children: ReactNode }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.tipo !== "parceiro") return <Navigate to="/mapa" replace />;
  return <>{children}</>;
}
