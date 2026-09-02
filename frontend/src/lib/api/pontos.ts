import { api } from "./client";
import type { NovoPontoPayload, PontoRetirada } from "@/types";

export const pontosApi = {
  listar: () => api.get<PontoRetirada[]>("/pontos/").then((r) => r.data),

  criar: (payload: NovoPontoPayload) =>
    api.post<PontoRetirada>("/pontos/", payload).then((r) => r.data),
};
