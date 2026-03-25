"use client";

import { usePathname } from "next/navigation";
import { Search, User, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

interface OrgData {
  name: string;
  slug: string;
}

const routeNames: Record<string, string> = {
  boards: "Quadros",
  processes: "Processos",
  tasks: "Tarefas",
  team: "Equipe",
  departments: "Departamentos",
  automations: "Automações",
  settings: "Configurações",
};

export function Header({ org }: { org: OrgData }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // Build breadcrumbs
  const segments = pathname
    .replace(`/${org.slug}`, "")
    .split("/")
    .filter(Boolean);
  const breadcrumbs = [
    { label: org.name, href: `/${org.slug}` },
    ...segments.map((seg, i) => ({
      label: routeNames[seg] || seg,
      href: `/${org.slug}/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header
      className="flex h-14 items-center justify-between px-6"
      style={{
        backgroundColor: "var(--aguia-bg)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-dark-400">/</span>}
            <span
              className={
                i === breadcrumbs.length - 1
                  ? "font-medium text-white"
                  : "text-dark-200"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="input-dark flex items-center gap-2 !w-auto !py-1.5"
        >
          <Search className="h-4 w-4 text-dark-200" />
          <span className="text-dark-300">Buscar...</span>
          <kbd className="ml-4 hidden rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-dark-200 sm:inline">
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Avatar */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, var(--aguia-primary), var(--aguia-secondary))",
            color: "#0B1120",
          }}
        >
          U
        </div>
      </div>
    </header>
  );
}
