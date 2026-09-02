import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/common/Button";
import { extrairMensagemErro } from "@/lib/errors";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login(email, senha);
      navigate("/mapa");
    } catch (err) {
      setErro(extrairMensagemErro(err, "E-mail ou senha inválidos."));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#F7F9FD 0%,#EDF2FA 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 392 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
          <img src="/point2go-logo-full.png" alt="Point2Go" style={{ width: 210, height: "auto", display: "block" }} />
        </div>

        <div className="p2g-card p2g-fade" style={{ boxShadow: "0 24px 48px -16px rgba(11,18,51,0.22)", padding: "36px 32px" }}>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 20, fontWeight: 700, color: "#101828", margin: "0 0 4px", textAlign: "center" }}>
            Entrar
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p2g-input"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                Senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="p2g-input"
              />
            </div>

            {erro && (
              <p style={{ fontSize: 13, color: "#B91C1C", background: "#FEE2E2", borderRadius: 8, padding: "10px 12px", margin: 0 }}>
                {erro}
              </p>
            )}

            <Button type="submit" disabled={carregando} style={{ width: "100%", height: 44, marginTop: 4 }}>
              {carregando ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p style={{ fontSize: 13, color: "#64748B", margin: "20px 0 0", textAlign: "center" }}>
            Ainda não tem conta? <Link to="/cadastro" style={{ fontWeight: 600 }}>Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
