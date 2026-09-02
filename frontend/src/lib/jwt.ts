export type JwtPayload = {
  user_id: number;
  tipo: "destinatario" | "parceiro";
  username?: string;
  exp: number;
  iat: number;
};

export function decodeJwtPayload(token: string): JwtPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(json);
}

export function isExpired(payload: JwtPayload): boolean {
  return Date.now() >= payload.exp * 1000;
}
