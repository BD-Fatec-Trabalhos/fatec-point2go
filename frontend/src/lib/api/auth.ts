import { api } from "./client";
import type { DadosCadastro } from "@/types";

export const authApi = {
  registrar: (dados: DadosCadastro) => api.post("/auth/registro", dados).then((r) => r.data),

  login: (email: string, password: string) =>
    api
      .post<{ access: string; refresh: string }>("/auth/login", { email, password })
      .then((r) => r.data),

  refresh: (refresh: string) =>
    api.post<{ access: string }>("/auth/login/refresh", { refresh }).then((r) => r.data),
};
