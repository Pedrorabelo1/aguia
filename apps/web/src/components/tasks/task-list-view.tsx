"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Clock, MessageSquare } from "lucide-react";
import { cn } from "@aguia/ui";
import type { TaskData } from "./task-card";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  TODO: { label: "A Fazer", color: "#64748B", bg: "rgba(100,116,139,0.15)" },
  IN_PROGRESS: { label: "Em Andamento", color: "#0EA5E9", bg: "rgba(14,165,233,0.15)" },
  IN_REVIEW: { label: "Em Revisão", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  BLOCKED: { label: "Bloqueado", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
  DONE: { label: "Concluído", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  CANCELLED: { label: "Cancelado", color: "#64748B", bg: "rgba(100,116,139,0.1)" },
};

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  URGENT: { label: "Urgente", color: "#EF4444" },
  HIGH: { label: "Alta", color: "#F97316" },
  MEDIUM: { label: "Média", color: "#0EA5E9" },
  LOW: { label: "Baixa", color: "#64748B" },
};

interface TaskListViewProps {
  tasks: TaskData[];
  onTaskClick: (id: string) => void;
}

type SortField = "title" | "status" | "priority" | "dueDate";

export function TaskListView({ tasks, onTaskClick }: TaskListViewProps) {
  const [sortField, setSortField] = useState<SortField>("status");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...tasks].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "title") return a.title.localeCompare(b.title) * dir;
    if (sortField === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir;
    }
    return a[sortField].localeCompare(b[sortField]) * dir;
  });

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp className={cn("h-3 w-3 -mb-1", sortField === field && sortDir === "asc" ? "text-white" : "text-dark-400")} />
      <ChevronDown className={cn("h-3 w-3", sortField === field && sortDir === "desc" ? "text-white" : "text-dark-400")} />
    </span>
  );

  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full table-dark">
        <thead>
          <tr>
            <th className="cursor-pointer" onClick={() => toggleSort("title")}>
              <span className="flex items-center">Título <SortIcon field="title" /></span>
            </th>
            <th className="cursor-pointer" onClick={() => toggleSort("status")}>
              <span className="flex items-center">Status <SortIcon field="status" /></span>
            </th>
            <th className="cursor-pointer" onClick={() => toggleSort("priority")}>
              <span className="flex items-center">Prioridade <SortIcon field="priority" /></span>
            </th>
            <th>Responsável</th>
            <th className="cursor-pointer" onClick={() => toggleSort("dueDate")}>
              <span className="flex items-center">Prazo <SortIcon field="dueDate" /></span>
            </th>
            <th>Labels</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((task) => {
            const status = STATUS_LABELS[task.status] || STATUS_LABELS.TODO;
            const priority = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS.MEDIUM;
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

            return (
              <tr key={task.id} onClick={() => onTaskClick(task.id)} className="cursor-pointer">
                <td>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dark-50">{task.title}</span>
                    {task.commentCount > 0 && (
                      <span className="flex items-center gap-0.5 text-[11px] text-dark-300">
                        <MessageSquare className="h-3 w-3" />
                        {task.commentCount}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: status.bg, color: status.color }}>
                    {status.label}
                  </span>
                </td>
                <td>
                  <span className="text-sm font-medium" style={{ color: priority.color }}>
                    {priority.label}
                  </span>
                </td>
                <td>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: "linear-gradient(135deg, var(--aguia-primary), var(--aguia-secondary))", color: "#0B1120" }}>
                        {task.assignee.displayName[0]}
                      </div>
                      <span className="text-sm text-dark-100">{task.assignee.displayName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-dark-400">—</span>
                  )}
                </td>
                <td>
                  {task.dueDate ? (
                    <span className={cn("flex items-center gap-1 text-sm", isOverdue ? "text-red-400 font-medium" : "text-dark-200")}>
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                    </span>
                  ) : (
                    <span className="text-sm text-dark-400">—</span>
                  )}
                </td>
                <td>
                  <div className="flex gap-1">
                    {task.labels.map((l) => (
                      <span key={l.id} className="rounded px-1.5 py-0.5 text-[10px] font-medium" style={{ backgroundColor: `${l.color}25`, color: l.color }}>
                        {l.name}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
