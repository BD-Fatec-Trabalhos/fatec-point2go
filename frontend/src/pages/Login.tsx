import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#F7F9FD] to-[#EDF2FA] p-6">
      <div className="w-full max-w-[460px]">
        <div className="mb-8 flex justify-center">
          <img src="/point2go-logo-full.png" alt="Point2Go" className="block h-auto w-[230px]" />
        </div>

        <Card className="animate-fade-up shadow-card px-10 py-11">
          <CardHeader>
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription className="mt-1.5">
              Acompanhe suas encomendas e escolha seu ponto de retirada.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[46px] text-[15px]"
                />
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-[46px] text-[15px]"
                />
              </div>

              {erro && (
                <p className="m-0 rounded-lg bg-destructive-bg px-3.5 py-2.5 text-sm text-destructive">{erro}</p>
              )}

              <Button type="submit" disabled={carregando} className="mt-1 h-[46px] w-full text-[15px]">
                {carregando ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link to="/cadastro" className="font-semibold text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
