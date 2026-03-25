"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List, Calendar, GanttChart, Search, Filter } from "lucide-react";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskListView } from "@/components/tasks/task-list-view";
import { TaskCalendarView } from "@/components/tasks/task-calendar-view";
import { TaskDetailDrawer } from "@/components/tasks/task-detail-drawer";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { useOrg } from "@/providers/org-provider";
import { cn } from "@aguia/ui";

type ViewType = "kanban" | "list" | "timeline" | "calendar";

const views = [
  { id: "kanban" as const, icon: LayoutGrid, label: "Kanban" },
  { id: "list" as const, icon: List, label: "Lista" },
  { id: "timeline" as const, icon: GanttChart, label: "Timeline" },
  { id: "calendar" as const, icon: Calendar, label: "Calendario" },
];

const MOCK_TASKS = [
  { id: "1", title: "Configurar banco de dados", status: "DONE" as const, priority: "HIGH" as const, assignee: { displayName: "Pedro", avatarUrl: null }, labels: [{ id: "l1", name: "Backend", color: "#3B82F6" }], commentCount: 3, dueDate: "2026-03-25", creatorId: "mock" },
  { id: "2", title: "Implementar autenticacao", status: "IN_PROGRESS" as const, priority: "URGENT" as const, assignee: { displayName: "Maria", avatarUrl: null }, labels: [{ id: "l2", name: "Auth", color: "#EF4444" }], commentCount: 1, dueDate: "2026-03-26", creatorId: "mock" },
  { id: "3", title: "Criar layout responsivo", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const, assignee: { displayName: "Joao", avatarUrl: null }, labels: [{ id: "l3", name: "Frontend", color: "#10B981" }], commentCount: 0, dueDate: null, creatorId: "mock" },
  { id: "4", title: "Escrever testes unitarios", status: "TODO" as const, priority: "MEDIUM" as const, assignee: null, labels: [], commentCount: 0, dueDate: "2026-03-28", creatorId: "mock" },
  { id: "5", title: "Documentar API", status: "TODO" as const, priority: "LOW" as const, assignee: { displayName: "Ana", avatarUrl: null }, labels: [{ id: "l1", name: "Backend", color: "#3B82F6" }], commentCount: 2, dueDate: null, creatorId: "mock" },
  { id: "6", title: "Revisar PR do modulo de pagamentos", status: "IN_REVIEW" as const, priority: "HIGH" as const, assignee: { displayName: "Pedro", avatarUrl: null }, labels: [{ id: "l4", name: "Review", color: "#F59E0B" }], commentCount: 5, dueDate: "2026-03-24", creatorId: "mock" },
  { id: "7", title: "Deploy para staging", status: "BLOCKED" as const, priority: "HIGH" as const, assignee: { displayName: "Carlos", avatarUrl: null }, labels: [{ id: "l5", name: "DevOps", color: "#8B5CF6" }], commentCount: 1, dueDate: "2026-03-27", creatorId: "mock" },
  { id: "8", title: "Migrar dados do sistema legado", status: "TODO" as const, priority: "URGENT" as const, assignee: null, labels: [{ id: "l1", name: "Backend", color: "#3B82F6" }], commentCount: 0, dueDate: "2026-03-30", creatorId: "mock" },
];

export default function TasksPage() {
  const org = useOrg();
  const [view, setView] = useState<ViewType>("kanban");
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const handleTaskMove = (taskId: string, newStatus: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as any } : t))
    );
  };

  const handleTaskReorder = (taskId: string, newStatus: string, newIndex: number) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;
      const others = prev.filter((t) => t.id !== taskId);
      const updated = { ...task, status: newStatus as any };
      const columnTasks = others.filter((t) => t.status === newStatus);
      const nonColumnTasks = others.filter((t) => t.status !== newStatus);
      columnTasks.splice(newIndex, 0, updated);
      return [...nonColumnTasks, ...columnTasks];
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tarefas</h1>
          <p className="text-sm text-dark-200">{tasks.length} tarefas</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.05)" }}>
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-all",
                  view === v.id
                    ? "bg-aguia-primary text-dark-900 font-medium"
                    : "text-dark-300 hover:text-dark-50"
                )}
              >
                <v.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="mt-6 flex-1 overflow-hidden">
        {view === "kanban" && (
          <KanbanBoard
            tasks={tasks}
            onTaskClick={(id) => setSelectedTaskId(id)}
            onTaskMove={handleTaskMove}
            onTaskReorder={handleTaskReorder}
          />
        )}
        {view === "list" && (
          <TaskListView
            tasks={tasks}
            onTaskClick={(id) => setSelectedTaskId(id)}
          />
        )}
        {view === "calendar" && (
          <TaskCalendarView
            tasks={tasks}
            onTaskClick={(id) => setSelectedTaskId(id)}
          />
        )}
        {view === "timeline" && (
          <div className="glass-card flex h-64 items-center justify-center text-dark-300">
            Visao Timeline em desenvolvimento
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={(updates) => {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === selectedTask.id ? { ...t, ...updates } : t
              )
            );
          }}
        />
      )}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(task) => {
            setTasks((prev) => [
              ...prev,
              {
                ...task,
                id: String(Date.now()),
                commentCount: 0,
                labels: [],
                assignee: null,
                creatorId: "mock",
              },
            ]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
