import { api } from "./client";
import type { Encomenda, EncomendaRastreio } from "@/types";

export const encomendasApi = {
  listar: () => api.get<Encomenda[]>("/encomendas/").then((r) => r.data),

  rastrear: (codigo: string) =>
    api.get<EncomendaRastreio>(`/encomendas/${encodeURIComponent(codigo)}/rastreio`).then((r) => r.data),
};
