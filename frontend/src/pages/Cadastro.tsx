import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extrairMensagemErro } from "@/lib/errors";
import type { TipoUsuario } from "@/types";

export function Cadastro() {
  const { cadastrarELogar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipo, setTipo] = useState<TipoUsuario>("destinatario");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    const cpfDigitos = cpf.replace(/\D/g, "");
    if (cpfDigitos.length !== 11) {
      setErro("Informe um CPF com 11 dígitos.");
      return;
    }

    const [firstName, ...resto] = nome.trim().split(/\s+/);

    setCarregando(true);
    try {
      await cadastrarELogar({
        username: email,
        email,
        password: senha,
        tipo,
        first_name: firstName ?? "",
        last_name: resto.join(" "),
        cpf: cpfDigitos,
      });
      navigate("/mapa");
    } catch (err) {
      setErro(extrairMensagemErro(err, "Não foi possível criar sua conta. Tente novamente."));
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
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription className="mt-1.5">Leva menos de um minuto.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  required
                  maxLength={14}
                  placeholder="Somente números"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>

              <div>
                <Label>Tipo de conta</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={tipo === "destinatario" ? "default" : "outline"}
                    onClick={() => setTipo("destinatario")}
                    className="rounded-full"
                  >
                    Destinatário
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={tipo === "parceiro" ? "default" : "outline"}
                    onClick={() => setTipo("parceiro")}
                    className="rounded-full"
                  >
                    Parceiro
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmar">Confirmar</Label>
                  <Input
                    id="confirmar"
                    type="password"
                    required
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                </div>
              </div>

              {erro && (
                <p className="m-0 rounded-lg bg-destructive-bg px-3.5 py-2.5 text-sm text-destructive">{erro}</p>
              )}

              <Button type="submit" disabled={carregando} className="mt-1 w-full">
                {carregando ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
