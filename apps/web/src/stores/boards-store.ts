"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BoardColumn {
  id: string;
  name: string;
  color: string;
  type: "status" | "text" | "number" | "date" | "person" | "label" | "priority" | "progress";
}

export interface BoardItem {
  id: string;
  groupId: string;
  values: Record<string, any>;
  order: number;
}

export interface BoardGroup {
  id: string;
  name: string;
  color: string;
  collapsed: boolean;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  columns: BoardColumn[];
  groups: BoardGroup[];
  items: BoardItem[];
  createdAt: string;
  view: "table" | "kanban" | "calendar" | "timeline" | "chart";
}

const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: "name", name: "Item", color: "#00D4AA", type: "text" },
  { id: "status", name: "Status", color: "#00D4AA", type: "status" },
  { id: "person", name: "Responsável", color: "#0EA5E9", type: "person" },
  { id: "date", name: "Prazo", color: "#F59E0B", type: "date" },
  { id: "priority", name: "Prioridade", color: "#EF4444", type: "priority" },
  { id: "progress", name: "Progresso", color: "#8B5CF6", type: "progress" },
];

const MOCK_BOARDS: Board[] = [
  {
    id: "board-1",
    name: "Sprint Planning",
    description: "Planejamento de sprints e tarefas de desenvolvimento",
    icon: "🚀",
    color: "#00D4AA",
    columns: DEFAULT_COLUMNS,
    groups: [
      { id: "g1", name: "Sprint 15 - Em Andamento", color: "#00D4AA", collapsed: false },
      { id: "g2", name: "Sprint 16 - Planejado", color: "#0EA5E9", collapsed: false },
      { id: "g3", name: "Backlog", color: "#64748B", collapsed: true },
    ],
    items: [
      { id: "i1", groupId: "g1", order: 0, values: { name: "Implementar autenticação OAuth", status: "working", person: "Pedro", date: "2026-03-28", priority: "high", progress: 65 } },
      { id: "i2", groupId: "g1", order: 1, values: { name: "Criar dashboard de métricas", status: "working", person: "Maria", date: "2026-03-26", priority: "high", progress: 40 } },
      { id: "i3", groupId: "g1", order: 2, values: { name: "Testes de integração API", status: "done", person: "Carlos", date: "2026-03-24", priority: "medium", progress: 100 } },
      { id: "i4", groupId: "g1", order: 3, values: { name: "Refatorar módulo de pagamentos", status: "stuck", person: "Ana", date: "2026-03-25", priority: "critical", progress: 20 } },
      { id: "i5", groupId: "g2", order: 0, values: { name: "Migração banco de dados", status: "pending", person: "Pedro", date: "2026-04-02", priority: "high", progress: 0 } },
      { id: "i6", groupId: "g2", order: 1, values: { name: "Design system v2", status: "pending", person: "João", date: "2026-04-05", priority: "medium", progress: 0 } },
      { id: "i7", groupId: "g2", order: 2, values: { name: "Documentação da API", status: "pending", person: "Maria", date: "2026-04-07", priority: "low", progress: 0 } },
      { id: "i8", groupId: "g3", order: 0, values: { name: "Suporte a multi-idioma", status: "pending", person: "", date: "", priority: "low", progress: 0 } },
      { id: "i9", groupId: "g3", order: 1, values: { name: "App mobile", status: "pending", person: "", date: "", priority: "medium", progress: 0 } },
    ],
    createdAt: "2026-03-01",
    view: "table",
  },
  {
    id: "board-2",
    name: "Marketing Q1",
    description: "Campanhas e ações de marketing do primeiro trimestre",
    icon: "📊",
    color: "#EC4899",
    columns: DEFAULT_COLUMNS,
    groups: [
      { id: "g1", name: "Campanhas Ativas", color: "#EC4899", collapsed: false },
      { id: "g2", name: "Em Planejamento", color: "#F59E0B", collapsed: false },
    ],
    items: [
      { id: "m1", groupId: "g1", order: 0, values: { name: "Campanha de lançamento", status: "working", person: "João", date: "2026-03-30", priority: "critical", progress: 75 } },
      { id: "m2", groupId: "g1", order: 1, values: { name: "Social media ads", status: "working", person: "Ana", date: "2026-03-28", priority: "high", progress: 50 } },
      { id: "m3", groupId: "g2", order: 0, values: { name: "Email marketing automação", status: "pending", person: "João", date: "2026-04-10", priority: "medium", progress: 10 } },
    ],
    createdAt: "2026-02-15",
    view: "table",
  },
  {
    id: "board-3",
    name: "Onboarding Clientes",
    description: "Processo de onboarding de novos clientes",
    icon: "👥",
    color: "#8B5CF6",
    columns: DEFAULT_COLUMNS,
    groups: [
      { id: "g1", name: "Novos Clientes", color: "#8B5CF6", collapsed: false },
      { id: "g2", name: "Concluídos", color: "#10B981", collapsed: true },
    ],
    items: [
      { id: "o1", groupId: "g1", order: 0, values: { name: "Empresa ABC - Setup", status: "working", person: "Carlos", date: "2026-03-27", priority: "high", progress: 60 } },
      { id: "o2", groupId: "g1", order: 1, values: { name: "Empresa XYZ - Treinamento", status: "pending", person: "Ana", date: "2026-04-01", priority: "medium", progress: 0 } },
      { id: "o3", groupId: "g2", order: 0, values: { name: "Empresa 123 - Completo", status: "done", person: "Pedro", date: "2026-03-20", priority: "low", progress: 100 } },
    ],
    createdAt: "2026-03-10",
    view: "table",
  },
];

interface BoardsStore {
  boards: Board[];
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  addItem: (boardId: string, groupId: string, item: BoardItem) => void;
  updateItem: (boardId: string, itemId: string, values: Record<string, any>) => void;
  deleteItem: (boardId: string, itemId: string) => void;
  addGroup: (boardId: string, group: BoardGroup) => void;
  updateGroup: (boardId: string, groupId: string, updates: Partial<BoardGroup>) => void;
  toggleGroupCollapse: (boardId: string, groupId: string) => void;
  addColumn: (boardId: string, column: BoardColumn) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
}

export const useBoardsStore = create<BoardsStore>()(
  persist(
    (set) => ({
      boards: MOCK_BOARDS,

      addBoard: (board) =>
        set((state) => ({ boards: [...state.boards, board] })),

      updateBoard: (id, updates) =>
        set((state) => ({
          boards: state.boards.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),

      deleteBoard: (id) =>
        set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),

      addItem: (boardId, groupId, item) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId ? { ...b, items: [...b.items, { ...item, groupId }] } : b
          ),
        })),

      updateItem: (boardId, itemId, values) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  items: b.items.map((i) =>
                    i.id === itemId ? { ...i, values: { ...i.values, ...values } } : i
                  ),
                }
              : b
          ),
        })),

      deleteItem: (boardId, itemId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId ? { ...b, items: b.items.filter((i) => i.id !== itemId) } : b
          ),
        })),

      addGroup: (boardId, group) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId ? { ...b, groups: [...b.groups, group] } : b
          ),
        })),

      updateGroup: (boardId, groupId, updates) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  groups: b.groups.map((g) =>
                    g.id === groupId ? { ...g, ...updates } : g
                  ),
                }
              : b
          ),
        })),

      toggleGroupCollapse: (boardId, groupId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  groups: b.groups.map((g) =>
                    g.id === groupId ? { ...g, collapsed: !g.collapsed } : g
                  ),
                }
              : b
          ),
        })),

      addColumn: (boardId, column) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId ? { ...b, columns: [...b.columns, column] } : b
          ),
        })),

      deleteColumn: (boardId, columnId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, columns: b.columns.filter((c) => c.id !== columnId) }
              : b
          ),
        })),
    }),
    { name: "aguia-boards" }
  )
);
