import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api/auth";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredEmail,
  saveSession,
} from "@/lib/api/client";
import { decodeJwtPayload, isExpired } from "@/lib/jwt";
import type { DadosCadastro, Usuario } from "@/types";

type AuthContextValue = {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, password: string) => Promise<void>;
  cadastrarELogar: (dados: DadosCadastro) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function usuarioFromToken(access: string, email: string): Usuario {
  const payload = decodeJwtPayload(access);
  return { userId: payload.user_id, tipo: payload.tipo, email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const access = getAccessToken();
      const email = getStoredEmail();
      if (!access || !email) {
        setCarregando(false);
        return;
      }

      const payload = decodeJwtPayload(access);
      if (!isExpired(payload)) {
        setUsuario(usuarioFromToken(access, email));
        setCarregando(false);
        return;
      }

      const refresh = getRefreshToken();
      if (!refresh) {
        clearSession();
        setCarregando(false);
        return;
      }

      try {
        const { access: novoAccess } = await authApi.refresh(refresh);
        saveSession(novoAccess, refresh, email);
        setUsuario(usuarioFromToken(novoAccess, email));
      } catch {
        clearSession();
      } finally {
        setCarregando(false);
      }
    }
    bootstrap();
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    const { access, refresh } = await authApi.login(email, password);
    saveSession(access, refresh, email);
    setUsuario(usuarioFromToken(access, email));
  };

  const cadastrarELogar: AuthContextValue["cadastrarELogar"] = async (dados) => {
    await authApi.registrar(dados);
    await login(dados.email, dados.password);
  };

  const logout = () => {
    clearSession();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, cadastrarELogar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return ctx;
}
