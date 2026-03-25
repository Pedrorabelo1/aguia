"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Search } from "lucide-react";
import { cn } from "@aguia/ui";

interface TeamMember {
  id: string;
  displayName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  isActive: boolean;
  department: string | null;
  tasksCount: number;
  lastSeenAt: string | null;
}

const MOCK_MEMBERS: TeamMember[] = [
  { id: "m1", displayName: "Pedro Souza", email: "pedro@empresa.com", role: "OWNER", avatarUrl: null, isActive: true, department: "Engenharia", tasksCount: 8, lastSeenAt: "2026-03-24T14:30:00Z" },
  { id: "m2", displayName: "Maria Santos", email: "maria@empresa.com", role: "ADMIN", avatarUrl: null, isActive: true, department: "Engenharia", tasksCount: 6, lastSeenAt: "2026-03-24T14:25:00Z" },
  { id: "m3", displayName: "João Silva", email: "joao@empresa.com", role: "MANAGER", avatarUrl: null, isActive: true, department: "Marketing", tasksCount: 7, lastSeenAt: "2026-03-24T13:00:00Z" },
  { id: "m4", displayName: "Ana Oliveira", email: "ana@empresa.com", role: "MEMBER", avatarUrl: null, isActive: true, department: "RH", tasksCount: 4, lastSeenAt: "2026-03-24T12:00:00Z" },
  { id: "m5", displayName: "Carlos Lima", email: "carlos@empresa.com", role: "MEMBER", avatarUrl: null, isActive: true, department: "Financeiro", tasksCount: 5, lastSeenAt: "2026-03-23T18:00:00Z" },
  { id: "m6", displayName: "Lucia Ferreira", email: "lucia@empresa.com", role: "VIEWER", avatarUrl: null, isActive: false, department: null, tasksCount: 0, lastSeenAt: null },
];

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  OWNER: { label: "Dono", color: "#A78BFA", bg: "rgba(167,139,250,0.15)" },
  ADMIN: { label: "Admin", color: "#0EA5E9", bg: "rgba(14,165,233,0.15)" },
  MANAGER: { label: "Gerente", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  MEMBER: { label: "Membro", color: "#94A3B8", bg: "rgba(148,163,184,0.15)" },
  VIEWER: { label: "Visualizador", color: "#64748B", bg: "rgba(100,116,139,0.15)" },
};

export default function TeamPage() {
  const [members] = useState(MOCK_MEMBERS);
  const [search, setSearch] = useState("");

  const filtered = members.filter(
    (m) =>
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const isOnline = (lastSeen: string | null) => {
    if (!lastSeen) return false;
    return Date.now() - new Date(lastSeen).getTime() < 15 * 60 * 1000;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipe</h1>
          <p className="text-sm text-dark-200">{members.length} membros</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Convidar
        </button>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="input-dark !pl-10"
        />
      </div>

      <div className="mt-4 glass-card overflow-hidden">
        <table className="w-full table-dark">
          <thead>
            <tr>
              <th>Membro</th>
              <th>Papel</th>
              <th>Departamento</th>
              <th>Tarefas</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => {
              const role = ROLE_LABELS[member.role] || ROLE_LABELS.MEMBER;
              const online = isOnline(member.lastSeenAt);

              return (
                <tr key={member.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                          style={{ background: "linear-gradient(135deg, var(--aguia-primary), var(--aguia-secondary))", color: "#0B1120" }}
                        >
                          {member.displayName[0]}
                        </div>
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full",
                            online ? "bg-emerald-500" : "bg-dark-400"
                          )}
                          style={{ border: "2px solid var(--aguia-surface)" }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-50">{member.displayName}</p>
                        <p className="text-xs text-dark-300">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ background: role.bg, color: role.color }}
                    >
                      {role.label}
                    </span>
                  </td>
                  <td>{member.department || "—"}</td>
                  <td>{member.tasksCount} ativas</td>
                  <td>
                    <span className={cn("flex items-center gap-1.5 text-xs", online ? "text-emerald-400" : "text-dark-400")}>
                      <div className={cn("h-1.5 w-1.5 rounded-full", online ? "bg-emerald-400" : "bg-dark-400")} />
                      {online ? "Online" : member.isActive ? "Offline" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <button className="rounded p-1.5 text-dark-400 hover:bg-white/5 hover:text-dark-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
