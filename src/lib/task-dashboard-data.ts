// Dados de demonstração para o Dashboard de Gerenciamento de Tarefas (Lumberjack).
// Modelados conforme o escopo: task recursiva, regime (obrigação/proposta),
// decisão pendente, papel, impedimento e referências temporais por fato.

export type Regime = "obrigacao" | "proposta" | "autorizado";
export type DecisaoPendente = "encaminhamento" | "aceitacao" | "analise" | "desbloqueio";
export type EstadoEfetivo =
  | "aguardando_decisao"
  | "aguardando_execucao"
  | "em_andamento"
  | "bloqueada"
  | "concluida"
  | "roadmap";

export interface TaskItem {
  id: string;
  titulo: string;
  origem: string | null;
  origemRef: string | null;
  regime: Regime;
  estado: EstadoEfetivo;
  papel: string | null;
  decisao?: DecisaoPendente;
  esperaDias?: number;
  predicado?: string;
  bloqueioCausa?: string;
  bloqueadaHa?: number;
  progresso?: number;
  filhos?: number;
  concluidos?: number;
  prazo?: string;
}

export const filaDecisao: TaskItem[] = [
  {
    id: "TSK-1042",
    titulo: "Produzir mesa de jantar 1,80m",
    origem: "Pedido BAR-71E5D2AD",
    origemRef: "Jose Gregorio",
    regime: "obrigacao",
    estado: "aguardando_decisao",
    papel: "Marcenaria",
    decisao: "encaminhamento",
    esperaDias: 2,
    predicado: "Obrigação derivada de pedido, aguarda encaminhamento há 2 dias",
  },
  {
    id: "TSK-1047",
    titulo: "Executar estofamento do sofá 3 lugares",
    origem: "Pedido BAR-284A08B5",
    origemRef: "Jose Gregorio",
    regime: "obrigacao",
    estado: "aguardando_decisao",
    papel: null,
    decisao: "encaminhamento",
    esperaDias: 4,
    predicado: "Papel indefinido — não se sabe qual função responde pelo trabalho",
  },
  {
    id: "TSK-1051",
    titulo: "Dedetização anual da fábrica",
    origem: null,
    origemRef: null,
    regime: "proposta",
    estado: "aguardando_decisao",
    papel: "Administrativo",
    decisao: "aceitacao",
    esperaDias: 6,
    predicado: "Proposta facultativa em triagem, aguarda aceitação há 6 dias",
  },
  {
    id: "TSK-1053",
    titulo: "Cortar a grama do jardim da frente",
    origem: null,
    origemRef: null,
    regime: "proposta",
    estado: "aguardando_decisao",
    papel: "Manutenção",
    decisao: "aceitacao",
    esperaDias: 11,
    predicado: "Em triagem além do tempo habitual da equipe",
  },
  {
    id: "TSK-1058",
    titulo: "Moldura de espelho — acabamento especial",
    origem: "Pedido BAR-2A8E3F6A",
    origemRef: "fenestraerp esquadrias",
    regime: "obrigacao",
    estado: "aguardando_decisao",
    papel: "Acabamento",
    decisao: "analise",
    esperaDias: 1,
    predicado: "Sinal negativo recebido do domínio, não avaliado há 1 dia",
  },
];

export const emAndamento: TaskItem[] = [
  {
    id: "TSK-0991",
    titulo: "Produzir sofá 3 lugares",
    origem: "Pedido BAR-284A08B5",
    origemRef: "Jose Gregorio",
    regime: "obrigacao",
    estado: "em_andamento",
    papel: "Estofaria",
    filhos: 3,
    concluidos: 1,
    progresso: 33,
    prazo: "28/08",
  },
  {
    id: "TSK-1003",
    titulo: "Cozinha planejada — módulos superiores",
    origem: "Pedido BAR-215E80A6",
    origemRef: "Cliente Smoke Online",
    regime: "obrigacao",
    estado: "em_andamento",
    papel: "Marcenaria",
    filhos: 5,
    concluidos: 4,
    progresso: 80,
    prazo: "24/08",
  },
  {
    id: "TSK-1010",
    titulo: "Preparar expedição do lote 44",
    origem: "Pedido BAR-C83F166D",
    origemRef: "Cliente Smoke Online",
    regime: "obrigacao",
    estado: "em_andamento",
    papel: "Expedição",
    filhos: 2,
    concluidos: 0,
    progresso: 15,
    prazo: "23/08",
  },
  {
    id: "TSK-1015",
    titulo: "Revisar contrato de manutenção predial",
    origem: null,
    origemRef: null,
    regime: "autorizado",
    estado: "em_andamento",
    papel: "Administrativo",
    progresso: 60,
  },
];

export const bloqueadas: TaskItem[] = [
  {
    id: "TSK-0987",
    titulo: "Executar estrutura do sofá",
    origem: "Pedido BAR-284A08B5",
    origemRef: "Jose Gregorio",
    regime: "obrigacao",
    estado: "bloqueada",
    papel: "Marcenaria",
    bloqueioCausa: "Falta de matéria-prima (madeira maciça)",
    bloqueadaHa: 3,
    decisao: "desbloqueio",
  },
  {
    id: "TSK-1021",
    titulo: "Entregar cozinha planejada ao cliente",
    origem: "Pedido BAR-215E80A6",
    origemRef: "Cliente Smoke Online",
    regime: "obrigacao",
    estado: "bloqueada",
    papel: "Logística",
    bloqueioCausa: "Indisponibilidade de veículo — impedimento externo",
    bloqueadaHa: 1,
    decisao: "desbloqueio",
  },
  {
    id: "TSK-1029",
    titulo: "Conferir itens do pedido",
    origem: "Pedido BAR-0CD298B3",
    origemRef: "fenestraerp esquadrias",
    regime: "obrigacao",
    estado: "bloqueada",
    papel: "Conferência",
    bloqueioCausa: "Dependência de outra task (TSK-0987)",
    bloqueadaHa: 3,
  },
];

export interface CompromissoItem {
  pedido: string;
  cliente: string;
  prazo: string;
  tasks: number;
  concluidas: number;
  progresso: number;
  saude: "preservado" | "ameacado" | "comprometido" | "sem_trabalho";
  motivo: string;
}

export const compromissos: CompromissoItem[] = [
  {
    pedido: "BAR-215E80A6",
    cliente: "Cliente Smoke Online",
    prazo: "24/08",
    tasks: 6,
    concluidas: 6,
    progresso: 100,
    saude: "comprometido",
    motivo: "Trabalho concluído, entrega inviabilizada por impedimento de logística",
  },
  {
    pedido: "BAR-284A08B5",
    cliente: "Jose Gregorio",
    prazo: "28/08",
    tasks: 8,
    concluidas: 3,
    progresso: 38,
    saude: "ameacado",
    motivo: "Bloqueio por matéria-prima há 3 dias no caminho crítico",
  },
  {
    pedido: "BAR-AA9B206A",
    cliente: "Cliente Smoke Online",
    prazo: "26/08",
    tasks: 0,
    concluidas: 0,
    progresso: 0,
    saude: "sem_trabalho",
    motivo: "Prazo se aproximando sem trabalho derivado ou encaminhado",
  },
  {
    pedido: "BAR-2A8E3F6A",
    cliente: "fenestraerp esquadrias",
    prazo: "01/09",
    tasks: 4,
    concluidas: 2,
    progresso: 50,
    saude: "ameacado",
    motivo: "Sinal negativo recebido do domínio, ainda não avaliado",
  },
  {
    pedido: "BAR-71E5D2AD",
    cliente: "Jose Gregorio",
    prazo: "05/09",
    tasks: 3,
    concluidas: 1,
    progresso: 33,
    saude: "preservado",
    motivo: "Trabalho restante cabe no tempo disponível",
  },
];

export interface PapelCobertura {
  papel: string;
  usuarios: number;
  ativos: number;
  emAndamento: number;
  aguardando: number;
  bloqueadas: number;
}

export const papeis: PapelCobertura[] = [
  { papel: "Marcenaria", usuarios: 4, ativos: 3, emAndamento: 5, aguardando: 3, bloqueadas: 1 },
  { papel: "Estofaria", usuarios: 2, ativos: 2, emAndamento: 3, aguardando: 1, bloqueadas: 0 },
  { papel: "Acabamento", usuarios: 3, ativos: 1, emAndamento: 1, aguardando: 4, bloqueadas: 0 },
  { papel: "Expedição", usuarios: 2, ativos: 2, emAndamento: 2, aguardando: 0, bloqueadas: 0 },
  { papel: "Logística", usuarios: 1, ativos: 0, emAndamento: 0, aguardando: 2, bloqueadas: 1 },
  { papel: "Conferência", usuarios: 2, ativos: 1, emAndamento: 1, aguardando: 1, bloqueadas: 1 },
  { papel: "Administrativo", usuarios: 3, ativos: 2, emAndamento: 2, aguardando: 2, bloqueadas: 0 },
  { papel: "Manutenção", usuarios: 0, ativos: 0, emAndamento: 0, aguardando: 1, bloqueadas: 0 },
];

export const arvoreExemplo = [
  { nivel: 0, id: "PED-284A08B5", titulo: "Pedido do cliente", estado: "macro" as const, papel: "Comercial" },
  { nivel: 1, id: "TSK-0985", titulo: "Produzir mesa", estado: "concluida" as const, papel: "Marcenaria" },
  { nivel: 1, id: "TSK-0991", titulo: "Produzir sofá", estado: "em_andamento" as const, papel: "Estofaria" },
  { nivel: 2, id: "TSK-0987", titulo: "Executar estrutura", estado: "bloqueada" as const, papel: "Marcenaria" },
  { nivel: 2, id: "TSK-0988", titulo: "Executar estofamento", estado: "aguardando_execucao" as const, papel: "Estofaria" },
  { nivel: 2, id: "TSK-0989", titulo: "Executar acabamento", estado: "aguardando_execucao" as const, papel: "Acabamento" },
  { nivel: 1, id: "TSK-1029", titulo: "Conferir itens", estado: "bloqueada" as const, papel: "Conferência" },
  { nivel: 1, id: "TSK-1010", titulo: "Preparar expedição", estado: "aguardando_execucao" as const, papel: "Expedição" },
  { nivel: 1, id: "TSK-1021", titulo: "Entregar ao cliente", estado: "bloqueada" as const, papel: "Logística" },
];
