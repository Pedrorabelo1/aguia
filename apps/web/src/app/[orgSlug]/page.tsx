"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  GitBranch,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid,
  Zap,
  Activity,
} from "lucide-react";
import { useOrg } from "@/providers/org-provider";
import Link from "next/link";

const DEPARTMENT_HEALTH = [
  { name: "Engenharia", total: 24, onTime: 20, delayed: 3, blocked: 1, health: "green" as const },
  { name: "Marketing", total: 15, onTime: 10, delayed: 4, blocked: 1, health: "yellow" as const },
  { name: "RH", total: 8, onTime: 8, delayed: 0, blocked: 0, health: "green" as const },
  { name: "Financeiro", total: 12, onTime: 5, delayed: 5, blocked: 2, health: "red" as const },
];

const ALERTS = [
  { id: 1, severity: "red" as const, title: "3 tarefas atrasadas no Financeiro", description: "Relatório mensal, conciliação bancária e DRE estão em atraso", time: "2h atrás" },
  { id: 2, severity: "yellow" as const, title: "Processo de Onboarding pode atrasar", description: "Etapa de aprovação pendente há 2 dias", time: "5h atrás" },
  { id: 3, severity: "green" as const, title: "Sprint 14 concluída com sucesso", description: "18 tarefas entregues dentro do prazo", time: "1d atrás" },
  { id: 4, severity: "yellow" as const, title: "Marketing com carga alta", description: "3 membros acima de 80% de capacidade", time: "1d atrás" },
];

const CAPACITY = [
  { name: "Pedro", role: "Engenharia", total: 8, done: 5, inProgress: 2, blocked: 1 },
  { name: "Maria", role: "Engenharia", total: 6, done: 3, inProgress: 3, blocked: 0 },
  { name: "João", role: "Marketing", total: 7, done: 2, inProgress: 3, blocked: 2 },
  { name: "Ana", role: "RH", total: 4, done: 3, inProgress: 1, blocked: 0 },
  { name: "Carlos", role: "Financeiro", total: 5, done: 1, inProgress: 2, blocked: 2 },
];

const STATS = [
  { label: "Tarefas Ativas", value: 47, change: "+12%", trend: "up" as const, icon: CheckCircle2, accent: "#00D4AA" },
  { label: "Processos Ativos", value: 8, change: "+2", trend: "up" as const, icon: GitBranch, accent: "#0EA5E9" },
  { label: "Membros Online", value: 12, change: "", trend: "neutral" as const, icon: Users, accent: "#8B5CF6" },
  { label: "Tarefas Atrasadas", value: 6, change: "-3", trend: "down" as const, icon: AlertTriangle, accent: "#EF4444" },
];

const SEVERITY_STYLES = {
  red: { dot: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)" },
  yellow: { dot: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)" },
  green: { dot: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
};

const HEALTH_COLORS = {
  green: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
};

export default function OrgDashboard() {
  const org = useOrg();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-dark-200">Visão geral da organização</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${org.slug}/boards`} className="btn-secondary">
            <LayoutGrid className="h-4 w-4" />
            Ver Quadros
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="stat-card p-5"
            style={{ "--card-accent": stat.accent } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${stat.accent}15` }}>
                <stat.icon className="h-4 w-4" style={{ color: stat.accent }} />
              </div>
              {stat.change && (
                <span
                  className="flex items-center gap-0.5 text-xs font-medium"
                  style={{
                    color:
                      stat.trend === "up"
                        ? stat.label === "Tarefas Atrasadas" ? "#EF4444" : "#10B981"
                        : stat.trend === "down"
                        ? stat.label === "Tarefas Atrasadas" ? "#10B981" : "#EF4444"
                        : "#64748B",
                  }}
                >
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-dark-200">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-aguia-primary" />
            <span className="text-sm font-semibold text-white">Progresso Geral</span>
          </div>
          <span className="text-sm font-bold text-aguia-primary">47%</span>
        </div>
        <div className="progress-bar !h-3">
          <div className="progress-fill" style={{ width: "47%" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department Health */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Semáforo de Departamentos</h2>
            <Link
              href={`/${org.slug}/departments`}
              className="flex items-center gap-1 text-xs text-aguia-primary hover:underline"
            >
              Ver todos <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {DEPARTMENT_HEALTH.map((dept) => {
              const pct = Math.round((dept.onTime / dept.total) * 100);
              return (
                <div key={dept.name} className="flex items-center gap-4">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: HEALTH_COLORS[dept.health] }} />
                  <div className="w-28">
                    <p className="text-sm font-medium text-dark-50">{dept.name}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
                      <div className="bg-emerald-500 rounded-l-full" style={{ width: `${(dept.onTime / dept.total) * 100}%` }} />
                      <div className="bg-amber-400" style={{ width: `${(dept.delayed / dept.total) * 100}%` }} />
                      <div className="bg-red-500 rounded-r-full" style={{ width: `${(dept.blocked / dept.total) * 100}%` }} />
                    </div>
                  </div>
                  <span className="w-14 text-right text-xs font-medium" style={{ color: HEALTH_COLORS[dept.health] }}>
                    {pct}% ok
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-4 text-[11px] text-dark-300">
            <span className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" /> Em dia
            </span>
            <span className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400" /> Atrasado
            </span>
            <span className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" /> Bloqueado
            </span>
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="glass-card p-5">
          <h2 className="font-semibold text-white">Alertas</h2>
          <div className="mt-4 space-y-3">
            {ALERTS.map((alert) => {
              const styles = SEVERITY_STYLES[alert.severity];
              return (
                <div
                  key={alert.id}
                  className="rounded-lg p-3"
                  style={{ background: styles.bg, border: `1px solid ${styles.border}` }}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: styles.dot }} />
                    <div>
                      <p className="text-sm font-medium text-dark-50">{alert.title}</p>
                      <p className="mt-0.5 text-xs text-dark-200">{alert.description}</p>
                      <p className="mt-1 text-[10px] text-dark-300">{alert.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Capacity View */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Capacidade da Equipe</h2>
          <Link
            href={`/${org.slug}/team`}
            className="flex items-center gap-1 text-xs text-aguia-primary hover:underline"
          >
            Ver equipe <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {CAPACITY.map((member) => {
            const capacity = Math.round(
              ((member.inProgress + member.blocked) / Math.max(member.total, 1)) * 100
            );
            return (
              <div key={member.name} className="flex items-center gap-4">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, var(--aguia-primary), var(--aguia-secondary))", color: "#0B1120" }}
                >
                  {member.name[0]}
                </div>
                <div className="w-24">
                  <p className="text-sm font-medium text-dark-50">{member.name}</p>
                  <p className="text-[10px] text-dark-300">{member.role}</p>
                </div>
                <div className="flex-1">
                  <div className="flex h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="bg-emerald-500" style={{ width: `${(member.done / member.total) * 100}%` }} />
                    <div className="bg-sky-500" style={{ width: `${(member.inProgress / member.total) * 100}%` }} />
                    <div className="bg-red-500" style={{ width: `${(member.blocked / member.total) * 100}%` }} />
                  </div>
                </div>
                <span
                  className="w-10 text-right text-xs font-medium"
                  style={{
                    color: capacity > 80 ? "#EF4444" : capacity > 50 ? "#F59E0B" : "#10B981",
                  }}
                >
                  {capacity}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-4 text-[11px] text-dark-300">
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500" /> Concluídas
          </span>
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-sky-500" /> Em andamento
          </span>
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500" /> Bloqueadas
          </span>
        </div>
      </div>
    </div>
  );
}
