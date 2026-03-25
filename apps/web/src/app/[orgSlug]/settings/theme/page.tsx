"use client";

import { useState } from "react";
import { useOrg } from "@/providers/org-provider";
import { Upload, LayoutDashboard, CheckSquare, Users, Settings } from "lucide-react";

const FONTS = ["Inter", "Roboto", "Open Sans", "Montserrat", "Poppins", "Lato", "Nunito", "Raleway"];

interface ThemeState {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  sidebarColor: string;
  fontFamily: string;
  logoUrl: string | null;
  faviconUrl: string | null;
}

export default function SettingsThemePage() {
  const org = useOrg();
  const [theme, setTheme] = useState<ThemeState>({
    primaryColor: org.primaryColor,
    secondaryColor: org.secondaryColor,
    accentColor: org.accentColor,
    bgColor: org.bgColor,
    sidebarColor: org.sidebarColor,
    fontFamily: org.fontFamily,
    logoUrl: org.logoUrl,
    faviconUrl: org.faviconUrl,
  });
  const [saving, setSaving] = useState(false);

  const updateTheme = (key: keyof ThemeState, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: API call
    setTimeout(() => setSaving(false), 1000);
  };

  const previewVars = {
    "--preview-primary": theme.primaryColor,
    "--preview-secondary": theme.secondaryColor,
    "--preview-accent": theme.accentColor,
    "--preview-bg": theme.bgColor,
    "--preview-sidebar": theme.sidebarColor,
    fontFamily: `${theme.fontFamily}, sans-serif`,
  } as React.CSSProperties;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Controls */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Identidade Visual</h2>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex items-center gap-4">
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Logo" className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
                <Upload className="h-6 w-6" />
              </div>
            )}
            <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
              Upload Logo
            </button>
          </div>
        </div>

        {/* Favicon Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Favicon</label>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400">
              <Upload className="h-4 w-4" />
            </div>
            <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
              Upload Favicon
            </button>
          </div>
        </div>

        {/* Color Pickers */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "primaryColor" as const, label: "Cor Primária" },
            { key: "secondaryColor" as const, label: "Cor Secundária" },
            { key: "accentColor" as const, label: "Cor de Destaque" },
            { key: "bgColor" as const, label: "Cor de Fundo" },
            { key: "sidebarColor" as const, label: "Cor da Sidebar" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={theme[key] as string}
                  onChange={(e) => updateTheme(key, e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border p-0.5"
                />
                <input
                  type="text"
                  value={theme[key] as string}
                  onChange={(e) => updateTheme(key, e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono uppercase"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Font Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Fonte</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => updateTheme("fontFamily", e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            {FONTS.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-aguia-primary px-6 py-2 text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar Tema"}
        </button>
      </div>

      {/* Live Preview */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div
          style={previewVars}
          className="overflow-hidden rounded-xl border shadow-lg"
        >
          <div className="flex h-80">
            {/* Mini Sidebar */}
            <div
              className="w-48 p-3 space-y-1"
              style={{ backgroundColor: "var(--preview-sidebar)" }}
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div
                  className="h-7 w-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: "var(--preview-primary)" }}
                >
                  {org.name[0]}
                </div>
                <span className="text-white text-xs font-medium truncate">{org.name}</span>
              </div>
              {[
                { icon: LayoutDashboard, label: "Dashboard", active: true },
                { icon: CheckSquare, label: "Tarefas", active: false },
                { icon: Users, label: "Equipe", active: false },
                { icon: Settings, label: "Config", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                    item.active ? "bg-white/15 text-white" : "text-gray-400"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1" style={{ backgroundColor: "var(--preview-bg)" }}>
              {/* Mini Header */}
              <div className="flex items-center justify-between border-b bg-white px-4 py-2">
                <span className="text-xs font-medium text-gray-900">Dashboard</span>
                <div className="h-5 w-5 rounded-full bg-gray-200" />
              </div>

              {/* Mini Cards */}
              <div className="p-4 space-y-3">
                <div className="rounded-lg bg-white p-3 shadow-sm border">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "var(--preview-primary)" }}
                    />
                    <span className="text-xs font-medium">Tarefa exemplo</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: "var(--preview-accent)" }}
                    >
                      Urgente
                    </span>
                    <span className="text-[10px] text-gray-400">Hoje</span>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm border">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "var(--preview-secondary)" }}
                    />
                    <span className="text-xs font-medium">Outro item</span>
                  </div>
                  <div className="mt-2 h-1.5 w-2/3 rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full w-1/2"
                      style={{ backgroundColor: "var(--preview-primary)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
