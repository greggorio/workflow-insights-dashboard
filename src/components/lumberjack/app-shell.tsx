import type { ReactNode } from "react";
import {
  Bell,
  ChevronRight,
  Grid2x2,
  Home,
  LayoutGrid,
  ListChecks,
  Menu,
  Mic,
  Package,
  Settings,
  Sparkles,
  Truck,
  Users,
  Wrench,
  ClipboardList,
  FileText,
  DollarSign,
  Clock,
  Boxes,
} from "lucide-react";

const railIcons = [
  LayoutGrid,
  Home,
  ClipboardList,
  FileText,
  DollarSign,
  Wrench,
  Grid2x2,
  Boxes,
  Package,
  Truck,
  Settings,
  Clock,
  Users,
  ListChecks,
];

export function AppShell({
  titulo,
  breadcrumb,
  icone,
  children,
}: {
  titulo: string;
  breadcrumb: string;
  icone: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-14 shrink-0 flex-col items-center gap-1 bg-rail py-3 md:flex">
        <span className="mb-3 text-sm font-bold tracking-tight text-rail-foreground">LU</span>
        {railIcons.map((Icon, i) => (
          <span
            key={i}
            className={`flex h-9 w-9 items-center justify-center rounded-md text-rail-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              i === 0 ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 px-5 pt-4">
          <Menu className="h-5 w-5 text-muted-foreground md:hidden" />
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
            <span>/</span>
            <span className="text-foreground/70">{breadcrumb}</span>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground shadow-sm lg:flex">
              <Sparkles className="h-4 w-4 text-warning" />
              <span className="w-44 truncate">Digite ou fale seu comando</span>
              <Mic className="h-4 w-4" />
            </div>
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Users className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">Root</span>
                <span className="label-caps block text-[10px] text-muted-foreground">System</span>
              </span>
            </div>
          </div>

          <h1 className="flex w-full items-center gap-3 pt-1 text-3xl font-bold tracking-tight text-primary">
            {icone}
            {titulo}
          </h1>
        </header>

        <main className="min-w-0 flex-1 px-5 pb-10 pt-4">{children}</main>
      </div>
    </div>
  );
}

export function PanelHeader({
  icone,
  titulo,
  legenda,
  acao,
}: {
  icone: ReactNode;
  titulo: string;
  legenda?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3">
      <span className="text-primary">{icone}</span>
      <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
      {legenda ? <span className="text-xs text-muted-foreground">{legenda}</span> : null}
      {acao ? <div className="ml-auto flex items-center gap-1 text-sm">{acao}</div> : null}
    </div>
  );
}

export function VerTudo({ label = "Abrir projeção" }: { label?: string }) {
  return (
    <span className="flex cursor-pointer items-center gap-1 text-sm font-medium text-primary hover:underline">
      {label}
      <ChevronRight className="h-4 w-4" />
    </span>
  );
}
