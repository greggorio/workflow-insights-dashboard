import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  GitBranch,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Loader2,
  ShieldAlert,
  Timer,
  UserRoundX,
  Users,
} from "lucide-react";

import { AppShell, PanelHeader, VerTudo } from "@/components/lumberjack/app-shell";
import {
  arvoreExemplo,
  bloqueadas,
  compromissos,
  emAndamento,
  filaDecisao,
  papeis,
  type CompromissoItem,
  type TaskItem,
} from "@/lib/task-dashboard-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard de Tarefas — Lumberjack" },
      {
        name: "description",
        content:
          "Visão gerencial do fluxo de trabalho: fila de decisão pendente, tarefas em andamento, bloqueios, cobertura de papéis e saúde dos compromissos.",
      },
      { property: "og:title", content: "Dashboard de Tarefas — Lumberjack" },
      {
        property: "og:description",
        content:
          "Fila de encaminhamento, triagem, bloqueios e risco sobre compromissos em uma única leitura gerencial.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskDashboard,
});

const decisaoLabel: Record<string, string> = {
  encaminhamento: "aguarda encaminhamento",
  aceitacao: "aguarda aceitação",
  analise: "aguarda análise",
  desbloqueio: "aguarda desbloqueio",
};

const regimeLabel: Record<string, string> = {
  obrigacao: "Obrigação",
  proposta: "Proposta",
  autorizado: "Autorizado",
};

function Kpi({
  icone,
  rotulo,
  valor,
  nota,
  tom,
}: {
  icone: React.ReactNode;
  rotulo: string;
  valor: string;
  nota: string;
  tom: "neutro" | "atencao" | "critico" | "ok";
}) {
  const borda = {
    neutro: "border-l-primary",
    atencao: "border-l-warning",
    critico: "border-l-danger",
    ok: "border-l-success",
  }[tom];
  const bolha = {
    neutro: "bg-secondary text-primary",
    atencao: "bg-warning-soft text-warning-foreground",
    critico: "bg-danger-soft text-danger",
    ok: "bg-success-soft text-success",
  }[tom];

  return (
    <div className={`kpi-card ${borda} p-4`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-md ${bolha}`}>{icone}</span>
        <span className="label-caps text-muted-foreground">{rotulo}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{valor}</p>
      <p className="mt-1 text-xs text-muted-foreground">{nota}</p>
    </div>
  );
}

function TagRegime({ regime }: { regime: TaskItem["regime"] }) {
  const cor =
    regime === "obrigacao"
      ? "bg-secondary text-secondary-foreground"
      : regime === "proposta"
        ? "bg-info-soft text-info"
        : "bg-muted text-muted-foreground";
  return <span className={`label-caps rounded px-1.5 py-0.5 text-[10px] ${cor}`}>{regimeLabel[regime]}</span>;
}

function CardTask({ task }: { task: TaskItem }) {
  const semPapel = !task.papel;
  return (
    <article className="rounded-md border border-border bg-surface-muted/60 p-3 transition-colors hover:bg-surface-muted">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <TagRegime regime={task.regime} />
            <span className="font-mono text-[11px] text-muted-foreground">{task.id}</span>
          </div>
          <h3 className="mt-1 truncate text-sm font-semibold text-foreground">{task.titulo}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {task.origem ? (
              <>
                {task.origem} · {task.origemRef}
              </>
            ) : (
              "Sem origem comercial — trabalho avulso"
            )}
          </p>
        </div>
        {task.esperaDias !== undefined ? (
          <span
            className={`label-caps shrink-0 rounded px-2 py-1 text-[10px] ${
              task.esperaDias >= 5 ? "bg-danger-soft text-danger" : "bg-warning-soft text-warning-foreground"
            }`}
          >
            {task.esperaDias}d
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          {semPapel ? (
            <>
              <UserRoundX className="h-3.5 w-3.5 text-danger" />
              <span className="font-medium text-danger">Papel indefinido</span>
            </>
          ) : (
            <>
              <Users className="h-3.5 w-3.5" />
              {task.papel}
            </>
          )}
        </span>
        {task.decisao ? (
          <span className="flex items-center gap-1 font-medium text-primary">
            <ClipboardCheck className="h-3.5 w-3.5" />
            {decisaoLabel[task.decisao]}
          </span>
        ) : null}
      </div>

      {task.predicado ? (
        <p className="mt-2 border-t border-border pt-2 text-[11px] italic text-muted-foreground">
          {task.predicado}
        </p>
      ) : null}
    </article>
  );
}

const saudeInfo: Record<
  CompromissoItem["saude"],
  { rotulo: string; classe: string; barra: string; icone: React.ReactNode }
> = {
  preservado: {
    rotulo: "Preservado",
    classe: "bg-success-soft text-success",
    barra: "bg-success",
    icone: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  ameacado: {
    rotulo: "Ameaçado",
    classe: "bg-warning-soft text-warning-foreground",
    barra: "bg-warning",
    icone: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  comprometido: {
    rotulo: "Comprometido",
    classe: "bg-danger-soft text-danger",
    barra: "bg-danger",
    icone: <ShieldAlert className="h-3.5 w-3.5" />,
  },
  sem_trabalho: {
    rotulo: "Sem trabalho derivado",
    classe: "bg-danger-soft text-danger",
    barra: "bg-muted-foreground",
    icone: <Inbox className="h-3.5 w-3.5" />,
  },
};

const estadoArvore: Record<string, { cor: string; rotulo: string }> = {
  macro: { cor: "bg-primary", rotulo: "Compromisso (observável)" },
  concluida: { cor: "bg-success", rotulo: "Concluída" },
  em_andamento: { cor: "bg-warning", rotulo: "Em andamento" },
  bloqueada: { cor: "bg-danger", rotulo: "Bloqueada" },
  aguardando_execucao: { cor: "bg-muted-foreground", rotulo: "Aguardando execução" },
};

function TaskDashboard() {
  const semPapel = filaDecisao.filter((t) => !t.papel).length;
  const papeisSemPessoa = papeis.filter((p) => p.ativos === 0).length;
  const totalAtivos = papeis.reduce((s, p) => s + p.ativos, 0);
  const totalUsuarios = papeis.reduce((s, p) => s + p.usuarios, 0);

  return (
    <AppShell
      titulo="Gerenciamento de Tarefas"
      breadcrumb="Tarefas"
      icone={<LayoutDashboard className="h-7 w-7" />}
    >
      {/* Indicadores */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Kpi
          icone={<Inbox className="h-4 w-4" />}
          rotulo="Aguardando encaminhamento"
          valor="12"
          nota="Obrigações derivadas de pedido"
          tom="atencao"
        />
        <Kpi
          icone={<ClipboardCheck className="h-4 w-4" />}
          rotulo="Em triagem"
          valor="7"
          nota="2 além do tempo habitual"
          tom="neutro"
        />
        <Kpi
          icone={<Loader2 className="h-4 w-4" />}
          rotulo="Em andamento"
          valor="18"
          nota="Em 7 papéis distintos"
          tom="ok"
        />
        <Kpi
          icone={<Ban className="h-4 w-4" />}
          rotulo="Bloqueadas"
          valor="3"
          nota="Obrigações mantidas, sem avanço"
          tom="critico"
        />
        <Kpi
          icone={<Timer className="h-4 w-4" />}
          rotulo="Atrasadas"
          valor="4"
          nota="Além do previsto de execução"
          tom="critico"
        />
        <Kpi
          icone={<UserRoundX className="h-4 w-4" />}
          rotulo="Sem papel definido"
          valor={String(semPapel + 2)}
          nota="Lacuna de encaminhamento"
          tom="atencao"
        />
      </section>

      {/* Força de trabalho — faixa */}
      <section className="panel mt-3 flex flex-wrap items-center gap-x-8 gap-y-4 p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Força de trabalho por papel</p>
            <p className="text-xs text-muted-foreground">
              Cobertura declarada — ocupação não é calculada (critério pendente)
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <p className="label-caps text-muted-foreground">Papéis mapeados</p>
            <p className="text-2xl font-bold">{papeis.length}</p>
          </div>
          <div>
            <p className="label-caps text-muted-foreground">Pessoas ativas hoje</p>
            <p className="text-2xl font-bold">
              {totalAtivos}
              <span className="text-base font-medium text-muted-foreground">/{totalUsuarios}</span>
            </p>
          </div>
          <div>
            <p className="label-caps text-muted-foreground">Papéis sem pessoa disponível</p>
            <p className="text-2xl font-bold text-danger">{papeisSemPessoa}</p>
          </div>
          <div>
            <p className="label-caps text-muted-foreground">Trabalho não encaminhado</p>
            <p className="text-2xl font-bold text-warning-foreground">14</p>
          </div>
        </div>
      </section>

      {/* Decisão pendente + Compromissos */}
      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.15fr]">
        <div className="panel">
          <PanelHeader
            icone={<ClipboardCheck className="h-5 w-5" />}
            titulo="Decisão pendente"
            legenda="Qual decisão cabe, quem pode tomá-la e há quanto tempo espera"
            acao={<VerTudo />}
          />
          <div className="space-y-2 p-3">
            {filaDecisao.map((t) => (
              <CardTask key={t.id} task={t} />
            ))}
          </div>
        </div>

        <div className="panel">
          <PanelHeader
            icone={<ShieldAlert className="h-5 w-5" />}
            titulo="Compromissos com o cliente"
            legenda="Progresso e saúde são leituras distintas"
            acao={<VerTudo label="Abrir visão macro" />}
          />
          <div className="divide-y divide-border">
            {compromissos.map((c) => {
              const s = saudeInfo[c.saude];
              return (
                <div key={c.pedido} className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-sm font-semibold text-foreground">{c.pedido}</span>
                    <span className="text-sm text-muted-foreground">{c.cliente}</span>
                    <span
                      className={`label-caps ml-auto flex items-center gap-1 rounded px-2 py-0.5 text-[10px] ${s.classe}`}
                    >
                      {s.icone}
                      {s.rotulo}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full ${s.barra}`} style={{ width: `${c.progresso}%` }} />
                    </div>
                    <span className="w-28 shrink-0 text-right text-xs text-muted-foreground">
                      {c.concluidas}/{c.tasks} tasks · {c.progresso}%
                    </span>
                    <span className="flex w-20 shrink-0 items-center justify-end gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {c.prazo}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{c.motivo}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Em andamento + Bloqueios + Papéis */}
      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="panel">
          <PanelHeader
            icone={<Loader2 className="h-5 w-5" />}
            titulo="Em andamento"
            legenda="Trabalho já encaminhado"
          />
          <div className="space-y-2 p-3">
            {emAndamento.map((t) => (
              <div key={t.id} className="rounded-md border border-border bg-surface-muted/60 p-3">
                <div className="flex items-center gap-2">
                  <TagRegime regime={t.regime} />
                  <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
                  {t.prazo ? (
                    <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {t.prazo}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-1 truncate text-sm font-semibold">{t.titulo}</h3>
                <p className="text-xs text-muted-foreground">
                  {t.papel}
                  {t.filhos ? ` · ${t.concluidos}/${t.filhos} subtasks` : ""}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-warning" style={{ width: `${t.progresso ?? 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <PanelHeader
            icone={<Ban className="h-5 w-5" />}
            titulo="Bloqueios"
            legenda="A obrigação permanece"
            acao={
              <span className="label-caps rounded bg-danger-soft px-2 py-0.5 text-[10px] text-danger">
                {bloqueadas.length} ativos
              </span>
            }
          />
          <div className="space-y-2 p-3">
            {bloqueadas.map((t) => (
              <div key={t.id} className="rounded-md border border-danger/25 bg-danger-soft/40 p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-danger" />
                  <span className="truncate text-sm font-semibold">{t.titulo}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.origem} · {t.papel}
                </p>
                <p className="mt-1.5 text-xs font-medium text-danger">{t.bloqueioCausa}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Bloqueada há {t.bloqueadaHa} {t.bloqueadaHa === 1 ? "dia" : "dias"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <PanelHeader
            icone={<Users className="h-5 w-5" />}
            titulo="Papéis"
            legenda="Cobertura e carga por função"
          />
          <div className="divide-y divide-border">
            {papeis.map((p) => (
              <div key={p.papel} className="flex items-center gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.papel}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.usuarios === 0
                      ? "Nenhum usuário vinculado"
                      : `${p.ativos}/${p.usuarios} pessoa(s) ativa(s)`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-[11px]">
                  <span className="rounded bg-warning-soft px-1.5 py-0.5 text-warning-foreground">
                    {p.emAndamento} em curso
                  </span>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">
                    {p.aguardando} na fila
                  </span>
                  {p.bloqueadas > 0 ? (
                    <span className="rounded bg-danger-soft px-1.5 py-0.5 text-danger">
                      {p.bloqueadas} bloq.
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Árvore */}
      <section className="panel mt-3">
        <PanelHeader
          icone={<GitBranch className="h-5 w-5" />}
          titulo="Árvore do compromisso"
          legenda="Pedido BAR-284A08B5 — Jose Gregorio"
          acao={<VerTudo label="Abrir projeção em árvore" />}
        />
        <div className="p-3">
          <div className="space-y-1">
            {arvoreExemplo.map((n) => {
              const e = estadoArvore[n.estado] ?? { cor: "bg-muted-foreground", rotulo: "—" };
              return (
                <div
                  key={n.id}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface-muted"
                  style={{ marginLeft: n.nivel * 24 }}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${e.cor}`} />
                  <span className="font-mono text-[11px] text-muted-foreground">{n.id}</span>
                  <span className={`text-sm ${n.nivel === 0 ? "font-bold text-primary" : "font-medium"}`}>
                    {n.titulo}
                  </span>
                  <span className="text-xs text-muted-foreground">{e.rotulo}</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {n.papel}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
            <ListChecks className="h-4 w-4" />
            A raiz é observável, não executável: seu encerramento decorre do resultado alcançado nos
            domínios, nunca da contagem de tasks concluídas.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
