"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutGrid,
  CheckSquare,
  Users,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  GitBranch,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@aguia/ui";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useState } from "react";

interface OrgData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  sidebarColor: string;
}

const navItems = [
  { href: "", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/boards", icon: LayoutGrid, label: "Quadros" },
  { href: "/processes", icon: GitBranch, label: "Processos" },
  { href: "/tasks", icon: CheckSquare, label: "Tarefas" },
  { href: "/team", icon: Users, label: "Equipe" },
  { href: "/departments", icon: Building2, label: "Departamentos" },
  { href: "/automations", icon: Zap, label: "Automações" },
  { href: "/settings", icon: Settings, label: "Configurações" },
];

export function Sidebar({ org }: { org: OrgData }) {
  const { collapsed, toggle } = useSidebarStore();
  const pathname = usePathname();
  const basePath = `/${org.slug}`;
  const [darkMode, setDarkMode] = useState(true);

  return (
    <aside
      className={cn(
        "flex flex-col transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60"
      )}
      style={{
        backgroundColor: "var(--aguia-sidebar)",
        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
        {org.logoUrl ? (
          <img
            src={org.logoUrl}
            alt={org.name}
            className="h-8 w-8 flex-shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, var(--aguia-primary), var(--aguia-secondary))`,
              color: "#0B1120",
            }}
          >
            {org.name[0]}
          </div>
        )}
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-white">
              {org.name}
            </span>
            <span className="text-[10px] text-dark-200">Workspace</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-2 pt-4">
        {navItems.map((item) => {
          const href = `${basePath}${item.href}`;
          const isActive =
            item.href === ""
              ? pathname === basePath
              : pathname.startsWith(href);

          return (
            <Link
              key={item.href}
              href={href}
              className={isActive ? "sidebar-item-active" : "sidebar-item"}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-2">
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 text-xs text-dark-200">
              {darkMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              <span>Modo {darkMode ? "Escuro" : "Claro"}</span>
            </div>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              darkMode ? "bg-aguia-primary" : "bg-dark-400"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                darkMode ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="mx-2 my-2 flex items-center justify-center rounded-lg py-2 text-dark-200 transition-colors hover:bg-white/5 hover:text-dark-50"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* User section */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, var(--aguia-primary), var(--aguia-secondary))",
              color: "#0B1120",
            }}
          >
            U
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                Usuário
              </p>
              <button className="flex items-center gap-1 text-xs text-dark-200 hover:text-dark-50 transition-colors">
                <LogOut className="h-3 w-3" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
