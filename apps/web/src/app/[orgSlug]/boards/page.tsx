"use client";

import { useState } from "react";
import { Plus, LayoutGrid, Search, MoreHorizontal, Star, Clock } from "lucide-react";
import { useOrg } from "@/providers/org-provider";
import { useBoardsStore } from "@/stores/boards-store";
import Link from "next/link";

export default function BoardsPage() {
  const org = useOrg();
  const { boards, addBoard } = useBoardsStore();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const filtered = boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newBoardName.trim()) return;
    const colors = ["#00D4AA", "#0EA5E9", "#EC4899", "#8B5CF6", "#F59E0B", "#EF4444"];
    const icons = ["📋", "🎯", "📊", "🚀", "💡", "⚡"];
    addBoard({
      id: `board-${Date.now()}`,
      name: newBoardName,
      description: "",
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      columns: [
        { id: "name", name: "Item", color: "#00D4AA", type: "text" },
        { id: "status", name: "Status", color: "#00D4AA", type: "status" },
        { id: "person", name: "Responsável", color: "#0EA5E9", type: "person" },
        { id: "date", name: "Prazo", color: "#F59E0B", type: "date" },
        { id: "priority", name: "Prioridade", color: "#EF4444", type: "priority" },
      ],
      groups: [
        { id: `g-${Date.now()}`, name: "Grupo 1", color: "#00D4AA", collapsed: false },
      ],
      items: [],
      createdAt: new Date().toISOString().split("T")[0],
      view: "table",
    });
    setNewBoardName("");
    setShowCreate(false);
  };

  const getItemCount = (board: typeof boards[0]) => board.items.length;
  const getDoneCount = (board: typeof boards[0]) =>
    board.items.filter((i) => i.values.status === "done").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quadros</h1>
          <p className="mt-1 text-sm text-dark-200">
            Gerencie seus projetos e fluxos de trabalho
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo Quadro
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
        <input
          type="text"
          placeholder="Buscar quadros..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark !pl-10"
        />
      </div>

      {/* Recent section */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-dark-300">
          <Clock className="h-3.5 w-3.5" />
          Recentes
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((board) => {
            const totalItems = getItemCount(board);
            const doneItems = getDoneCount(board);
            const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

            return (
              <Link
                key={board.id}
                href={`/${org.slug}/boards/${board.id}`}
                className="glass-card-hover p-5 block"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{board.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{board.name}</h3>
                      {board.description && (
                        <p className="mt-0.5 text-xs text-dark-200 line-clamp-1">
                          {board.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); }}
                    className="rounded p-1 text-dark-300 hover:bg-white/5 hover:text-dark-50"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium" style={{ color: board.color }}>
                    {pct}%
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-dark-300">
                  <span>{totalItems} itens</span>
                  <span>{board.groups.length} grupos</span>
                </div>

                {/* Color bar at bottom */}
                <div
                  className="mt-4 h-1 rounded-full"
                  style={{ background: board.color, opacity: 0.6 }}
                />
              </Link>
            );
          })}

          {/* Create new board card */}
          <button
            onClick={() => setShowCreate(true)}
            className="glass-card-hover flex min-h-[160px] flex-col items-center justify-center gap-3 p-5 text-dark-300 hover:text-dark-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Criar Novo Quadro</span>
          </button>
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-white">Novo Quadro</h2>
            <p className="mt-1 text-sm text-dark-200">
              Crie um quadro para organizar suas tarefas e projetos
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-100">
                  Nome do quadro
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Ex: Sprint Planning, Marketing Q1..."
                  className="input-dark"
                  autoFocus
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowCreate(false); setNewBoardName(""); }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button onClick={handleCreate} className="btn-primary">
                Criar Quadro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
