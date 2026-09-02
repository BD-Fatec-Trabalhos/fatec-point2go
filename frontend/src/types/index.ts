// Formas reais devolvidas pela API do backend (Django REST Framework).

export type Endereco = {
  id?: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  latitude?: string | null;
  longitude?: string | null;
};

export type AreaRestricao = {
  id: number;
  nome: string;
  cidade: string;
  bairros_atendidos: string;
  motivo: string;
};

export type PontoRetirada = {
  id: number;
  nome: string;
  endereco: Endereco;
  area_restricao: AreaRestricao | null;
  horario_funcionamento: string;
  capacidade_total: number;
  capacidade_ocupada: number;
  ativo: boolean;
};

export type StatusEncomenda =
  | "em_transito"
  | "aguardando_retirada"
  | "retirada_confirmada"
  | "devolvido";

export type Encomenda = {
  id: number;
  codigo_rastreio: string;
  destinatario: number;
  ponto: number | null;
  status_atual: StatusEncomenda;
  data_criacao: string;
  prazo_guarda: string | null;
};

export type Movimentacao = {
  id: number;
  data_hora: string;
  tipo_evento: string;
  descricao: string;
};

export type EncomendaRastreio = Encomenda & {
  movimentacoes: Movimentacao[];
};

export type TipoUsuario = "destinatario" | "parceiro";

export type Usuario = {
  userId: number;
  email: string;
  tipo: TipoUsuario;
};

export type DadosCadastro = {
  username: string;
  password: string;
  email: string;
  tipo: TipoUsuario;
  first_name: string;
  last_name: string;
  telefone?: string;
  cpf: string;
};

export type NovoPontoPayload = {
  nome: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    latitude?: string;
    longitude?: string;
  };
  horario_funcionamento: string;
  capacidade_total: number;
  area_restricao_id?: number;
};
