import { Fragment, useMemo, useState, type FormEvent } from "react";
import { Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { useAppData } from "@/context/AppDataContext";
import { STATUS_LABEL, MOVIMENTACAO_LABEL, type Encomenda, type StatusEncomenda } from "@/types";

const badgeVariantByStatus: Record<StatusEncomenda, "neutral" | "info" | "warning" | "success" | "danger"> = {
  aguardando_recebimento: "neutral",
  recebida_no_ponto: "info",
  disponivel_para_retirada: "warning",
  retirada: "success",
  devolvida: "danger",
};

const vazio = {
  codigoRastreio: "",
  destinatarioNome: "",
  destinatarioDocumento: "",
  destinatarioTelefone: "",
  pontoRetiradaId: "",
};

export function Encomendas() {
  const { encomendas, pontos, movimentacoes, addEncomenda } = useAppData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(vazio);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusEncomenda | "todos">("todos");
  const [expandido, setExpandido] = useState<string | null>(null);

  function set<K extends keyof typeof vazio>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const resultado = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return encomendas.filter((e) => {
      const bateBusca =
        !termo ||
        e.codigoRastreio.toLowerCase().includes(termo) ||
        e.destinatarioNome.toLowerCase().includes(termo);
      const bateStatus = filtroStatus === "todos" || e.status === filtroStatus;
      return bateBusca && bateStatus;
    });
  }, [encomendas, busca, filtroStatus]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nova: Encomenda = {
      id: `e${Date.now()}`,
      codigoRastreio: form.codigoRastreio,
      destinatarioNome: form.destinatarioNome,
      destinatarioDocumento: form.destinatarioDocumento,
      destinatarioTelefone: form.destinatarioTelefone,
      pontoRetiradaId: form.pontoRetiradaId,
      status: "aguardando_recebimento",
      criadaEm: new Date().toISOString(),
      atualizadaEm: new Date().toISOString(),
    };
    addEncomenda(nova);
    setForm(vazio);
    setOpen(false);
  }

  return (
    <AppLayout title="Encomendas" subtitle="Cadastro e consulta de status">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por código de rastreio ou destinatário"
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Select
            className="sm:w-64"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as StatusEncomenda | "todos")}
          >
            <option value="todos">Todos os status</option>
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> Nova encomenda
        </Button>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Código de rastreio</Th>
            <Th>Destinatário</Th>
            <Th>Ponto de retirada</Th>
            <Th>Status</Th>
            <Th>Atualizado em</Th>
          </Tr>
        </Thead>
        <Tbody>
          {resultado.map((enc) => {
            const ponto = pontos.find((p) => p.id === enc.pontoRetiradaId);
            const aberto = expandido === enc.id;
            const historico = movimentacoes
              .filter((m) => m.encomendaId === enc.id)
              .sort((a, b) => (a.dataHora < b.dataHora ? 1 : -1));

            return (
              <Fragment key={enc.id}>
                <Tr className="cursor-pointer" onClick={() => setExpandido(aberto ? null : enc.id)}>
                  <Td>{aberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</Td>
                  <Td className="font-mono text-xs">{enc.codigoRastreio}</Td>
                  <Td className="font-medium">{enc.destinatarioNome}</Td>
                  <Td>{ponto?.nome ?? "—"}</Td>
                  <Td><Badge variant={badgeVariantByStatus[enc.status]}>{STATUS_LABEL[enc.status]}</Badge></Td>
                  <Td className="text-xs text-muted-foreground">{new Date(enc.atualizadaEm).toLocaleString("pt-BR")}</Td>
                </Tr>
                {aberto && (
                  <Tr>
                    <Td colSpan={6} className="bg-muted/30">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Histórico de movimentações
                      </p>
                      {historico.length === 0 && (
                        <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada ainda.</p>
                      )}
                      <ul className="space-y-1.5">
                        {historico.map((m) => (
                          <li key={m.id} className="text-sm flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="font-medium">{MOVIMENTACAO_LABEL[m.tipo]}</span>
                            <span className="text-muted-foreground text-xs font-mono">
                              {new Date(m.dataHora).toLocaleString("pt-BR")} · {m.responsavel}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Td>
                  </Tr>
                )}
              </Fragment>
            );
          })}
          {resultado.length === 0 && (
            <Tr>
              <Td colSpan={6} className="text-center text-muted-foreground py-8">
                Nenhuma encomenda encontrada para essa busca.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Modal open={open} onClose={() => setOpen(false)} title="Cadastrar encomenda">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="codigoRastreio">Código de rastreio</Label>
            <Input id="codigoRastreio" required value={form.codigoRastreio} onChange={(e) => set("codigoRastreio", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pontoRetiradaId">Ponto de retirada de destino</Label>
            <Select id="pontoRetiradaId" required value={form.pontoRetiradaId} onChange={(e) => set("pontoRetiradaId", e.target.value)}>
              <option value="">Selecione...</option>
              {pontos.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="destinatarioNome">Nome do destinatário</Label>
            <Input id="destinatarioNome" required value={form.destinatarioNome} onChange={(e) => set("destinatarioNome", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="destinatarioDocumento">CPF</Label>
              <Input id="destinatarioDocumento" required value={form.destinatarioDocumento} onChange={(e) => set("destinatarioDocumento", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="destinatarioTelefone">Telefone</Label>
              <Input id="destinatarioTelefone" required value={form.destinatarioTelefone} onChange={(e) => set("destinatarioTelefone", e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar encomenda</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
