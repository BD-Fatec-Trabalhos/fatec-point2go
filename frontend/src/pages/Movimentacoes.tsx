import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { useAppData } from "@/context/AppDataContext";
import { MOVIMENTACAO_LABEL, type Movimentacao, type TipoMovimentacao, type StatusEncomenda } from "@/types";

// Cada tipo de movimentação implica automaticamente uma atualização de
// status da encomenda vinculada (regra de negócio da seção 3.4 do TG).
const STATUS_RESULTANTE: Record<TipoMovimentacao, StatusEncomenda> = {
  entrada_no_ponto: "recebida_no_ponto",
  transferencia: "disponivel_para_retirada",
  retirada_destinatario: "retirada",
  devolucao: "devolvida",
};

const vazio = {
  encomendaId: "",
  tipo: "entrada_no_ponto" as TipoMovimentacao,
  pontoOrigemId: "",
  pontoDestinoId: "",
  responsavel: "",
  observacao: "",
};

export function Movimentacoes() {
  const { movimentacoes, encomendas, pontos, addMovimentacao, updateEncomendaStatus } = useAppData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(vazio);

  function set<K extends keyof typeof vazio>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nova: Movimentacao = {
      id: `m${Date.now()}`,
      encomendaId: form.encomendaId,
      tipo: form.tipo,
      pontoOrigemId: form.pontoOrigemId || undefined,
      pontoDestinoId: form.pontoDestinoId || undefined,
      responsavel: form.responsavel,
      observacao: form.observacao || undefined,
      dataHora: new Date().toISOString(),
    };
    addMovimentacao(nova);
    updateEncomendaStatus(form.encomendaId, STATUS_RESULTANTE[form.tipo]);
    setForm(vazio);
    setOpen(false);
  }

  const ordenadas = [...movimentacoes].sort((a, b) => (a.dataHora < b.dataHora ? 1 : -1));

  return (
    <AppLayout title="Movimentações" subtitle="Registro de entrada, transferência, retirada e devolução de encomendas">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> Registrar movimentação
        </Button>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Encomenda</Th>
            <Th>Tipo</Th>
            <Th>Origem → Destino</Th>
            <Th>Responsável</Th>
            <Th>Data/hora</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ordenadas.map((m) => {
            const encomenda = encomendas.find((e) => e.id === m.encomendaId);
            const origem = pontos.find((p) => p.id === m.pontoOrigemId);
            const destino = pontos.find((p) => p.id === m.pontoDestinoId);
            return (
              <Tr key={m.id}>
                <Td className="font-mono text-xs">{encomenda?.codigoRastreio ?? "—"}</Td>
                <Td className="font-medium">{MOVIMENTACAO_LABEL[m.tipo]}</Td>
                <Td className="text-sm text-muted-foreground">
                  {origem?.nome ?? "—"} → {destino?.nome ?? "—"}
                </Td>
                <Td>{m.responsavel}</Td>
                <Td className="text-xs text-muted-foreground">{new Date(m.dataHora).toLocaleString("pt-BR")}</Td>
              </Tr>
            );
          })}
          {ordenadas.length === 0 && (
            <Tr>
              <Td colSpan={5} className="text-center text-muted-foreground py-8">
                Nenhuma movimentação registrada ainda.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Modal open={open} onClose={() => setOpen(false)} title="Registrar movimentação">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="encomendaId">Encomenda</Label>
            <Select id="encomendaId" required value={form.encomendaId} onChange={(e) => set("encomendaId", e.target.value)}>
              <option value="">Selecione...</option>
              {encomendas.map((e) => (
                <option key={e.id} value={e.id}>{e.codigoRastreio} — {e.destinatarioNome}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de movimentação</Label>
            <Select id="tipo" required value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
              {Object.entries(MOVIMENTACAO_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pontoOrigemId">Ponto de origem</Label>
              <Select id="pontoOrigemId" value={form.pontoOrigemId} onChange={(e) => set("pontoOrigemId", e.target.value)}>
                <option value="">—</option>
                {pontos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="pontoDestinoId">Ponto de destino</Label>
              <Select id="pontoDestinoId" value={form.pontoDestinoId} onChange={(e) => set("pontoDestinoId", e.target.value)}>
                <option value="">—</option>
                {pontos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="responsavel">Responsável pelo registro</Label>
            <Input id="responsavel" required value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="observacao">Observação (opcional)</Label>
            <Textarea id="observacao" value={form.observacao} onChange={(e) => set("observacao", e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
