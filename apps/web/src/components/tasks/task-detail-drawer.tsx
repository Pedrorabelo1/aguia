"use client";

import { useState } from "react";
import { X, Clock, MessageSquare, Send, ChevronDown } from "lucide-react";
import type { TaskData } from "./task-card";

const STATUSES = [
  { value: "TODO", label: "A Fazer", color: "#64748B" },
  { value: "IN_PROGRESS", label: "Em Andamento", color: "#0EA5E9" },
  { value: "IN_REVIEW", label: "Em Revisão", color: "#F59E0B" },
  { value: "BLOCKED", label: "Bloqueado", color: "#EF4444" },
  { value: "DONE", label: "Concluído", color: "#10B981" },
  { value: "CANCELLED", label: "Cancelado", color: "#64748B" },
];

const PRIORITIES = [
  { value: "URGENT", label: "Urgente", color: "#EF4444" },
  { value: "HIGH", label: "Alta", color: "#F97316" },
  { value: "MEDIUM", label: "Média", color: "#0EA5E9" },
  { value: "LOW", label: "Baixa", color: "#64748B" },
];

interface TaskDetailDrawerProps {
  task: TaskData;
  onClose: () => void;
  onUpdate: (updates: Partial<TaskData>) => void;
}

export function TaskDetailDrawer({ task, onClose, onUpdate }: TaskDetailDrawerProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const currentStatus = STATUSES.find((s) => s.value === task.status) || STATUSES[0];
  const currentPriority = PRIORITIES.find((p) => p.value === task.priority) || PRIORITIES[2];

  const handleTitleBlur = () => {
    if (title !== task.title && title.trim()) {
      onUpdate({ title });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col shadow-2xl"
        style={{ background: "var(--aguia-surface)", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-xs font-mono text-dark-400">#{task.id.slice(-6)}</span>
          <button onClick={onClose} className="rounded-lg p-1 text-dark-300 hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="space-y-6 p-6">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full text-xl font-bold text-white bg-transparent focus:outline-none"
            />

            <div className="flex gap-4">
              <div className="relative">
                <label className="mb-1 block text-xs font-medium text-dark-300">Status</label>
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: currentStatus.color }} />
                  <span className="text-dark-100">{currentStatus.label}</span>
                  <ChevronDown className="h-3 w-3 text-dark-400" />
                </button>
                {showStatusMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
                    <div className="dropdown-menu absolute left-0 top-full z-20 mt-1 w-44 p-1">
                      {STATUSES.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => { onUpdate({ status: s.value }); setShowStatusMenu(false); }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-dark-100 hover:bg-white/5"
                        >
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <label className="mb-1 block text-xs font-medium text-dark-300">Prioridade</label>
                <button
                  onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: currentPriority.color }} />
                  <span className="text-dark-100">{currentPriority.label}</span>
                  <ChevronDown className="h-3 w-3 text-dark-400" />
                </button>
                {showPriorityMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowPriorityMenu(false)} />
                    <div className="dropdown-menu absolute left-0 top-full z-20 mt-1 w-40 p-1">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => { onUpdate({ priority: p.value }); setShowPriorityMenu(false); }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-dark-100 hover:bg-white/5"
                        >
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-dark-300">Prazo</label>
                <div className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Clock className="h-3.5 w-3.5 text-dark-300" />
                  <input
                    type="date"
                    defaultValue={task.dueDate || ""}
                    onChange={(e) => onUpdate({ dueDate: e.target.value || null })}
                    className="border-0 bg-transparent p-0 text-sm text-dark-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-dark-300">Responsável</label>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{ background: "linear-gradient(135deg, var(--aguia-primary), var(--aguia-secondary))", color: "#0B1120" }}>
                    {task.assignee.displayName[0]}
                  </div>
                  <span className="text-sm text-dark-100">{task.assignee.displayName}</span>
                </div>
              ) : (
                <button className="text-sm text-dark-300 hover:text-dark-100">+ Atribuir responsável</button>
              )}
            </div>

            {task.labels.length > 0 && (
              <div>
                <label className="mb-1 block text-xs font-medium text-dark-300">Labels</label>
                <div className="flex flex-wrap gap-1.5">
                  {task.labels.map((label) => (
                    <span key={label.id} className="rounded-md px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${label.color}25`, color: label.color }}>
                      {label.name}
                    </span>
                  ))}
                  <button className="rounded-md px-2 py-1 text-xs text-dark-400 hover:text-dark-200" style={{ border: "1px dashed rgba(255,255,255,0.15)" }}>
                    + Label
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-dark-300">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicionar descrição..."
                rows={4}
                className="input-dark"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-dark-300">Subtarefas</label>
              <button className="flex items-center gap-2 text-sm text-dark-300 hover:text-dark-100">
                + Adicionar subtarefa
              </button>
            </div>
          </div>

          <div className="p-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-dark-100">
              <MessageSquare className="h-4 w-4" />
              Comentários
            </h3>
            <div className="mt-4 space-y-3">
              {task.commentCount === 0 && <p className="text-sm text-dark-400">Nenhum comentário ainda</p>}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escrever um comentário..."
                className="input-dark flex-1"
                onKeyDown={(e) => { if (e.key === "Enter" && newComment.trim()) setNewComment(""); }}
              />
              <button disabled={!newComment.trim()} className="btn-primary !px-3 disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
