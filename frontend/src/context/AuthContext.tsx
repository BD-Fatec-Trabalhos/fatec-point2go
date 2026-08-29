import { createContext, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "@/types";

type AuthContextValue = {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<{ ok: boolean; erro?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Usuário de demonstração. Quando o endpoint de autenticação do backend
// existir, substituir esta função por uma chamada real via `api.post(...)`.
const USUARIO_DEMO: Usuario = {
  id: "u1",
  nome: "Ana Ferreira",
  email: "admin@pudos.com.br",
  perfil: "admin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login: AuthContextValue["login"] = async (email, senha) => {
    await new Promise((r) => setTimeout(r, 400)); // simula latência de rede

    if (email.trim().toLowerCase() === USUARIO_DEMO.email && senha === "pudos123") {
      setUsuario(USUARIO_DEMO);
      return { ok: true };
    }
    return { ok: false, erro: "E-mail ou senha inválidos." };
  };

  const logout = () => setUsuario(null);

  return <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return ctx;
}
