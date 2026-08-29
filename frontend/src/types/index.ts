// Entidades do sistema, conforme a seção 3.2 do TG
// (Usuário, Parceiro, Ponto de retirada, Endereço, Encomenda,
// Status da encomenda, Movimentação)

export type Endereco = {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type Parceiro = {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  ativo: boolean;
  criadoEm: string;
};

export type DiaSemana = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

export type PontoRetirada = {
  id: string;
  nome: string;
  parceiroId: string;
  endereco: Endereco;
  capacidade: number;
  ocupacaoAtual: number;
  horarioAbertura: string; // "08:00"
  horarioFechamento: string; // "18:00"
  diasFuncionamento: DiaSemana[];
  disponivel: boolean;
};

export type StatusEncomenda =
  | "aguardando_recebimento"
  | "recebida_no_ponto"
  | "disponivel_para_retirada"
  | "retirada"
  | "devolvida";

export const STATUS_LABEL: Record<StatusEncomenda, string> = {
  aguardando_recebimento: "Aguardando recebimento",
  recebida_no_ponto: "Recebida no ponto",
  disponivel_para_retirada: "Disponível para retirada",
  retirada: "Retirada pelo destinatário",
  devolvida: "Devolvida",
};

export type Encomenda = {
  id: string;
  codigoRastreio: string;
  destinatarioNome: string;
  destinatarioDocumento: string;
  destinatarioTelefone: string;
  pontoRetiradaId: string;
  status: StatusEncomenda;
  criadaEm: string;
  atualizadaEm: string;
};

export type TipoMovimentacao =
  | "entrada_no_ponto"
  | "transferencia"
  | "retirada_destinatario"
  | "devolucao";

export const MOVIMENTACAO_LABEL: Record<TipoMovimentacao, string> = {
  entrada_no_ponto: "Entrada no ponto",
  transferencia: "Transferência entre pontos",
  retirada_destinatario: "Retirada pelo destinatário",
  devolucao: "Devolução",
};

export type Movimentacao = {
  id: string;
  encomendaId: string;
  tipo: TipoMovimentacao;
  pontoOrigemId?: string;
  pontoDestinoId?: string;
  responsavel: string;
  observacao?: string;
  dataHora: string;
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: "admin" | "parceiro" | "operador";
};
