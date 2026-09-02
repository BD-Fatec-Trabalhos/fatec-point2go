export function extrairMensagemErro(err: unknown, mensagemPadrao: string): string {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (data && typeof data === "object") {
    const mensagens = Object.values(data as Record<string, unknown>)
      .flat()
      .map(String);
    if (mensagens.length) return mensagens.join(" ");
  }
  if (typeof data === "string" && data.trim()) return data;
  return mensagemPadrao;
}
