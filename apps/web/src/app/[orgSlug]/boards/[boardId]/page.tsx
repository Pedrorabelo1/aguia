"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  List,
  Calendar,
  GanttChart,
  BarChart3,
  Search,
  Filter,
  Trash2,
  User,
} from "lucide-react";
import { useOrg } from "@/providers/org-provider";
import { useBoardsStore, type Board, type BoardItem, type BoardGroup } from "@/stores/boards-store";
import { cn } from "@aguia/ui";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendente", color: "#64748B", bg: "rgba(100,116,139,0.15)" },
  { value: "working", label: "Em Progresso", color: "#0EA5E9", bg: "rgba(14,165,233,0.15)" },
  { value: "done", label: "Concluído", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  { value: "stuck", label: "Bloqueado", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
  { value: "review", label: "Em Revisão", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
];

const PRIORITY_OPTIONS = [
  { value: "critical", label: "Crítico", color: "#EF4444", bg: "rgba(239,68,68,0.2)" },
  { value: "high", label: "Alto", color: "#F97316", bg: "rgba(249,115,22,0.15)" },
  { value: "medium", label: "Médio", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  { value: "low", label: "Baixo", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
];

const VIEWS = [
  { id: "table" as const, icon: List, label: "Tabela" },
  { id: "kanban" as const, icon: LayoutGrid, label: "Kanban" },
  { id: "calendar" as const, icon: Calendar, label: "Calendário" },
  { id: "timeline" as const, icon: GanttChart, label: "Timeline" },
  { id: "chart" as const, icon: BarChart3, label: "Gráficos" },
];

function StatusCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full rounded px-2 py-1 text-xs font-medium text-center"
        style={{ background: status.bg, color: status.color }}
      >
        {status.label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="dropdown-menu absolute left-0 top-full z-50 mt-1 w-36 p-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-white/5"
              >
                <div className="h-2 w-2 rounded-full" style={{ background: opt.color }} />
                <span style={{ color: opt.color }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PriorityCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const priority = PRIORITY_OPTIONS.find((p) => p.value === value) || PRIORITY_OPTIONS[2];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full rounded px-2 py-1 text-xs font-medium text-center"
        style={{ background: priority.bg, color: priority.color }}
      >
        {priority.label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="dropdown-menu absolute left-0 top-full z-50 mt-1 w-32 p-1">
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-white/5"
              >
                <div className="h-2 w-2 rounded-full" style={{ background: opt.color }} />
                <span style={{ color: opt.color }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProgressCell({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const color = value >= 100 ? "#10B981" : value >= 50 ? "#0EA5E9" : value > 0 ? "#F59E0B" : "#64748B";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-[10px] font-medium w-7 text-right" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

function PersonCell({ value }: { value: string }) {
  if (!value) return <span className="text-dark-400 text-xs">—</span>;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-aguia-primary text-[9px] font-bold text-dark-900">
        {value[0]}
      </div>
      <span className="text-xs text-dark-100">{value}</span>
    </div>
  );
}

function DateCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  if (!value) return <span className="text-dark-400 text-xs">—</span>;
  const d = new Date(value + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = d < today;
  const formatted = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  return (
    <span className={cn("text-xs", isPast ? "text-red-400" : "text-dark-100")}>
      {formatted}
    </span>
  );
}

export default function BoardDetailPage() {
  const { boardId } = useParams<{ orgSlug: string; boardId: string }>();
  const org = useOrg();
  const { boards, updateItem, addItem, deleteItem, toggleGroupCollapse, addGroup, updateBoard } = useBoardsStore();
  const board = boards.find((b) => b.id === boardId);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [addingToGroup, setAddingToGroup] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");

  if (!board) {
    return (
      <div className="flex h-64 items-center justify-center text-dark-300">
        Quadro não encontrado
      </div>
    );
  }

  const handleAddItem = (groupId: string) => {
    if (!newItemName.trim()) return;
    addItem(boardId, groupId, {
      id: `item-${Date.now()}`,
      groupId,
      order: board.items.filter((i) => i.groupId === groupId).length,
      values: {
        name: newItemName,
        status: "pending",
        person: "",
        date: "",
        priority: "medium",
        progress: 0,
      },
    });
    setNewItemName("");
    setAddingToGroup(null);
  };

  const handleAddGroup = () => {
    const colors = ["#00D4AA", "#0EA5E9", "#EC4899", "#8B5CF6", "#F59E0B", "#EF4444"];
    addGroup(boardId, {
      id: `g-${Date.now()}`,
      name: `Novo Grupo`,
      color: colors[board.groups.length % colors.length],
      collapsed: false,
    });
  };

  const filteredItems = search
    ? board.items.filter((i) =>
        i.values.name?.toLowerCase().includes(search.toLowerCase())
      )
    : board.items;

  return (
    <div className="space-y-4">
      {/* Board header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{board.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-white">{board.name}</h1>
            {board.description && (
              <p className="text-sm text-dark-200">{board.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.05)" }}>
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => updateBoard(boardId, { view: v.id })}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-all",
                  board.view === v.id
                    ? "bg-aguia-primary text-dark-900 font-medium"
                    : "text-dark-300 hover:text-dark-50"
                )}
              >
                <v.icon className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-300" />
          <input
            type="text"
            placeholder="Buscar itens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark !py-1.5 !pl-8 !text-xs !w-52"
          />
        </div>
        <button className="btn-secondary !py-1.5 !text-xs">
          <Filter className="h-3.5 w-3.5" />
          Filtrar
        </button>
        <button className="btn-secondary !py-1.5 !text-xs">
          <User className="h-3.5 w-3.5" />
          Pessoa
        </button>
      </div>

      {/* Table view */}
      {board.view === "table" && (
        <div className="glass-card overflow-hidden">
          {/* Column headers */}
          <div className="flex items-center text-xs font-medium uppercase tracking-wider text-dark-300"
               style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-10 px-3 py-3" />
            <div className="flex-1 min-w-[250px] px-3 py-3">Item</div>
            {board.columns.filter(c => c.id !== "name").map((col) => (
              <div key={col.id} className="w-32 px-3 py-3 text-center">
                <span style={{ color: col.color }}>{col.name}</span>
              </div>
            ))}
            <div className="w-10" />
          </div>

          {/* Groups */}
          {board.groups.map((group) => {
            const groupItems = filteredItems.filter((i) => i.groupId === group.id);

            return (
              <div key={group.id}>
                {/* Group header */}
                <button
                  onClick={() => toggleGroupCollapse(boardId, group.id)}
                  className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {group.collapsed ? (
                    <ChevronRight className="h-4 w-4 text-dark-300" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-dark-300" />
                  )}
                  <div className="h-3 w-3 rounded" style={{ background: group.color }} />
                  <span className="text-sm font-semibold" style={{ color: group.color }}>
                    {group.name}
                  </span>
                  <span className="text-xs text-dark-400 ml-1">
                    {groupItems.length} itens
                  </span>
                </button>

                {/* Group items */}
                {!group.collapsed && (
                  <>
                    {groupItems
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center hover:bg-white/[0.02] transition-colors group"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                            borderLeft: `3px solid ${group.color}`,
                          }}
                        >
                          <div className="w-10 px-3 py-2.5">
                            <div className="h-4 w-4 rounded border border-dark-400 hover:border-aguia-primary cursor-pointer" />
                          </div>
                          <div className="flex-1 min-w-[250px] px-3 py-2.5">
                            {editingItem === item.id ? (
                              <input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={() => {
                                  updateItem(boardId, item.id, { name: editingName });
                                  setEditingItem(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateItem(boardId, item.id, { name: editingName });
                                    setEditingItem(null);
                                  }
                                  if (e.key === "Escape") setEditingItem(null);
                                }}
                                className="input-dark !py-0.5 !text-sm"
                                autoFocus
                              />
                            ) : (
                              <span
                                className="text-sm text-dark-50 cursor-pointer hover:text-white"
                                onClick={() => {
                                  setEditingItem(item.id);
                                  setEditingName(item.values.name || "");
                                }}
                              >
                                {item.values.name}
                              </span>
                            )}
                          </div>

                          {board.columns.filter(c => c.id !== "name").map((col) => (
                            <div key={col.id} className="w-32 px-2 py-2.5">
                              {col.type === "status" && (
                                <StatusCell
                                  value={item.values[col.id] || "pending"}
                                  onChange={(v) => updateItem(boardId, item.id, { [col.id]: v })}
                                />
                              )}
                              {col.type === "priority" && (
                                <PriorityCell
                                  value={item.values[col.id] || "medium"}
                                  onChange={(v) => updateItem(boardId, item.id, { [col.id]: v })}
                                />
                              )}
                              {col.type === "person" && (
                                <PersonCell value={item.values[col.id] || ""} />
                              )}
                              {col.type === "date" && (
                                <DateCell
                                  value={item.values[col.id] || ""}
                                  onChange={(v) => updateItem(boardId, item.id, { [col.id]: v })}
                                />
                              )}
                              {col.type === "progress" && (
                                <ProgressCell
                                  value={item.values[col.id] || 0}
                                  onChange={(v) => updateItem(boardId, item.id, { [col.id]: v })}
                                />
                              )}
                            </div>
                          ))}

                          <div className="w-10 flex justify-center">
                            <button
                              onClick={() => deleteItem(boardId, item.id)}
                              className="opacity-0 group-hover:opacity-100 rounded p-1 text-dark-400 hover:text-red-400 hover:bg-white/5 transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                    {/* Add item row */}
                    {addingToGroup === group.id ? (
                      <div
                        className="flex items-center px-3 py-2"
                        style={{ borderLeft: `3px solid ${group.color}` }}
                      >
                        <div className="w-10" />
                        <input
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onBlur={() => { if (newItemName) handleAddItem(group.id); else setAddingToGroup(null); }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddItem(group.id);
                            if (e.key === "Escape") { setAddingToGroup(null); setNewItemName(""); }
                          }}
                          placeholder="+ Adicionar item"
                          className="input-dark !py-1 !text-sm flex-1"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingToGroup(group.id)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-dark-400 hover:text-dark-200 hover:bg-white/[0.02] transition-colors"
                        style={{ borderLeft: `3px solid transparent` }}
                      >
                        <div className="w-10" />
                        <Plus className="h-3.5 w-3.5" />
                        <span>Adicionar item</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {/* Add group */}
          <button
            onClick={handleAddGroup}
            className="flex w-full items-center gap-2 px-3 py-3 text-xs text-dark-400 hover:text-dark-200 hover:bg-white/[0.02] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar novo grupo</span>
          </button>
        </div>
      )}

      {/* Kanban view */}
      {board.view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_OPTIONS.map((status) => {
            const items = filteredItems.filter((i) => i.values.status === status.value);
            return (
              <div key={status.value} className="min-w-[280px] flex-shrink-0">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: status.color }} />
                  <span className="text-sm font-medium" style={{ color: status.color }}>
                    {status.label}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-dark-300">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => {
                    const priority = PRIORITY_OPTIONS.find((p) => p.value === item.values.priority);
                    return (
                      <div key={item.id} className="glass-card p-3 cursor-pointer hover:border-white/15 transition-colors">
                        <p className="text-sm text-white">{item.values.name}</p>
                        <div className="mt-2 flex items-center justify-between">
                          {item.values.person && (
                            <div className="flex items-center gap-1.5">
                              <div className="h-5 w-5 rounded-full bg-aguia-primary flex items-center justify-center text-[9px] font-bold text-dark-900">
                                {item.values.person[0]}
                              </div>
                              <span className="text-[10px] text-dark-200">{item.values.person}</span>
                            </div>
                          )}
                          {priority && (
                            <span
                              className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                              style={{ background: priority.bg, color: priority.color }}
                            >
                              {priority.label}
                            </span>
                          )}
                        </div>
                        {item.values.progress > 0 && (
                          <div className="mt-2">
                            <ProgressCell value={item.values.progress} onChange={() => {}} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Other views placeholder */}
      {board.view !== "table" && board.view !== "kanban" && (
        <div className="glass-card flex h-64 items-center justify-center text-dark-300">
          <p>Visão {VIEWS.find((v) => v.id === board.view)?.label} em desenvolvimento</p>
        </div>
      )}
    </div>
  );
}
