"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, MessageSquare, GitBranch, UserPlus } from "lucide-react";
import { cn } from "@aguia/ui";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "task:assigned", title: "Nova tarefa atribuída", body: "Implementar autenticação foi atribuída a você", link: null, isRead: false, createdAt: "2026-03-24T10:30:00Z" },
  { id: "n2", type: "task:commented", title: "Novo comentário", body: "Pedro comentou em 'Configurar banco de dados'", link: null, isRead: false, createdAt: "2026-03-24T09:15:00Z" },
  { id: "n3", type: "process:activated", title: "Processo iniciado", body: "Onboarding de Funcionário foi ativado", link: null, isRead: false, createdAt: "2026-03-23T16:00:00Z" },
  { id: "n4", type: "member:joined", title: "Novo membro", body: "Ana Silva entrou na organização", link: null, isRead: true, createdAt: "2026-03-23T11:00:00Z" },
  { id: "n5", type: "task:completed", title: "Tarefa concluída", body: "Setup do ambiente de dev foi marcada como concluída", link: null, isRead: true, createdAt: "2026-03-22T14:30:00Z" },
];

const TYPE_ICONS: Record<string, React.ElementType> = {
  "task:assigned": Check,
  "task:commented": MessageSquare,
  "task:completed": Check,
  "process:activated": GitBranch,
  "member:joined": UserPlus,
};

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-dark-200 hover:bg-white/5 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="dropdown-menu absolute right-0 top-full z-50 mt-2 w-80">
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-sm font-semibold text-white">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-aguia-primary hover:underline"
                >
                  <CheckCheck className="h-3 w-3" />
                  Marcar todas
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {notifications.map((notif) => {
                const Icon = TYPE_ICONS[notif.type] || Bell;
                return (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5",
                      !notif.isRead && "bg-white/[0.03]"
                    )}
                  >
                    <div className="mt-0.5 rounded-lg bg-white/5 p-1.5">
                      <Icon className="h-3.5 w-3.5 text-dark-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm text-dark-100", !notif.isRead && "font-medium text-white")}>
                        {notif.title}
                      </p>
                      {notif.body && (
                        <p className="mt-0.5 text-xs text-dark-300 truncate">
                          {notif.body}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-dark-400">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-aguia-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
