import type { StatusEncomenda } from "@/types";

export const STATUS_INFO: Record<StatusEncomenda, { label: string; bg: string; fg: string }> = {
  em_transito: { label: "Em trânsito", bg: "#F1F5F9", fg: "#64748B" },
  aguardando_retirada: { label: "Aguardando retirada", bg: "#FEF3D8", fg: "#B45309" },
  retirada_confirmada: { label: "Retirada confirmada", bg: "#DCFCE7", fg: "#15803D" },
  devolvido: { label: "Devolvido", bg: "#FEE2E2", fg: "#B91C1C" },
};

// Progressão feliz da encomenda; "devolvido" é tratado como estado
// terminal alternativo (banner), não como um passo desta linha.
export const STATUS_ORDER: StatusEncomenda[] = [
  "em_transito",
  "aguardando_retirada",
  "retirada_confirmada",
];
