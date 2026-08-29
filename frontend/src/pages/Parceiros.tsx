import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { useAppData } from "@/context/AppDataContext";
import type { Parceiro } from "@/types";

const vazio = {
  nomeFantasia: "",
  razaoSocial: "",
  cnpj: "",
  responsavel: "",
  telefone: "",
  email: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export function Parceiros() {
  const { parceiros, addParceiro } = useAppData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(vazio);

  function set<K extends keyof typeof vazio>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const novo: Parceiro = {
      id: `p${Date.now()}`,
      nomeFantasia: form.nomeFantasia,
      razaoSocial: form.razaoSocial,
      cnpj: form.cnpj,
      responsavel: form.responsavel,
      telefone: form.telefone,
      email: form.email,
      endereco: {
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf,
      },
      ativo: true,
      criadoEm: new Date().toISOString().slice(0, 10),
    };
    addParceiro(novo);
    setForm(vazio);
    setOpen(false);
  }

  return (
    <AppLayout title="Parceiros" subtitle="Empresas responsáveis pelos pontos de retirada">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> Novo parceiro
        </Button>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Nome fantasia</Th>
            <Th>CNPJ</Th>
            <Th>Responsável</Th>
            <Th>Cidade</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {parceiros.map((p) => (
            <Tr key={p.id}>
              <Td className="font-medium">{p.nomeFantasia}</Td>
              <Td className="font-mono text-xs">{p.cnpj}</Td>
              <Td>{p.responsavel}</Td>
              <Td>{p.endereco.cidade}/{p.endereco.uf}</Td>
              <Td>
                <Badge variant={p.ativo ? "success" : "neutral"}>{p.ativo ? "Ativo" : "Inativo"}</Badge>
              </Td>
            </Tr>
          ))}
          {parceiros.length === 0 && (
            <Tr>
              <Td colSpan={5} className="text-center text-muted-foreground py-8">
                Nenhum parceiro cadastrado ainda.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Modal open={open} onClose={() => setOpen(false)} title="Cadastrar parceiro">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label htmlFor="nomeFantasia">Nome fantasia</Label>
              <Input id="nomeFantasia" required value={form.nomeFantasia} onChange={(e) => set("nomeFantasia", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="razaoSocial">Razão social</Label>
              <Input id="razaoSocial" required value={form.razaoSocial} onChange={(e) => set("razaoSocial", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" required placeholder="00.000.000/0000-00" value={form.cnpj} onChange={(e) => set("cnpj", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="responsavel">Responsável</Label>
              <Input id="responsavel" required value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" required value={form.telefone} onChange={(e) => set("telefone", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>

            <div className="col-span-2 pt-2 border-t border-border" />

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" required value={form.cep} onChange={(e) => set("cep", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" required value={form.numero} onChange={(e) => set("numero", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input id="logradouro" required value={form.logradouro} onChange={(e) => set("logradouro", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" required value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" required value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="uf">UF</Label>
              <Input id="uf" required maxLength={2} value={form.uf} onChange={(e) => set("uf", e.target.value.toUpperCase())} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar parceiro</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
