"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (task: {
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate: string | null;
  }) => void;
}

export function CreateTaskModal({ onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description: description || undefined, status, priority, dueDate: dueDate || null });
  };

  const selectClass = "input-dark appearance-none cursor-pointer";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Nova Tarefa</h2>
            <button onClick={onClose} className="rounded-lg p-1 text-dark-300 hover:bg-white/5 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-100">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da tarefa"
                className="mt-1 input-dark"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição opcional"
                rows={3}
                className="mt-1 input-dark"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-100">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={`mt-1 ${selectClass}`}>
                  <option value="TODO">A Fazer</option>
                  <option value="IN_PROGRESS">Em Andamento</option>
                  <option value="IN_REVIEW">Em Revisão</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-100">Prioridade</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className={`mt-1 ${selectClass}`}>
                  <option value="URGENT">Urgente</option>
                  <option value="HIGH">Alta</option>
                  <option value="MEDIUM">Média</option>
                  <option value="LOW">Baixa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100">Prazo</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 input-dark"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={!title.trim()} className="btn-primary disabled:opacity-50">
                Criar Tarefa
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
