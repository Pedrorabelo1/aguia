"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrg } from "@/providers/org-provider";
import { cn } from "@aguia/ui";

const tabs = [
  { href: "", label: "Geral" },
  { href: "/theme", label: "Identidade Visual" },
  { href: "/departments", label: "Departamentos" },
  { href: "/labels", label: "Labels" },
  { href: "/notifications", label: "Notificações" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const org = useOrg();
  const pathname = usePathname();
  const basePath = `/${org.slug}/settings`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Configurações</h1>
      <p className="mt-1 text-dark-200">Gerencie sua organização</p>

      <div className="mt-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <nav className="flex gap-6">
          {tabs.map((tab) => {
            const href = `${basePath}${tab.href}`;
            const isActive = tab.href === ""
              ? pathname === basePath
              : pathname.startsWith(href);

            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  "border-b-2 pb-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-aguia-primary text-aguia-primary"
                    : "border-transparent text-dark-300 hover:text-dark-50"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
