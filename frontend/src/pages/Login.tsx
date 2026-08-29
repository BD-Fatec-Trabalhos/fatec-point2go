import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Route } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@pudos.com.br");
  const [senha, setSenha] = useState("pudos123");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    const resultado = await login(email, senha);
    setCarregando(false);

    if (resultado.ok) navigate("/");
    else setErro(resultado.erro ?? "Não foi possível entrar.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
            <Route size={18} className="text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground tracking-tight">PUDOs</span>
        </div>

        <div className="rounded-lg border border-border bg-white shadow-sm p-6">
          <h1 className="font-display text-lg font-semibold text-foreground mb-1">Entrar</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Acesse o painel de gestão de pontos de retirada.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">{erro}</p>
            )}

            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-5 text-center">
            Demonstração — use <strong>admin@pudos.com.br</strong> / <strong>pudos123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
