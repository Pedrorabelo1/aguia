"use client";

import { useState } from "react";
import { useOrg } from "@/providers/org-provider";

export default function SettingsGeneralPage() {
  const org = useOrg();
  const [name, setName] = useState(org.name);
  const [slug, setSlug] = useState(org.slug);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-dark-100">Nome da Organização</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 input-dark"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-100">Slug (URL)</label>
        <div className="mt-1 flex items-center rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="px-3 text-sm text-dark-300">aguia.com/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            className="w-full rounded-r-lg bg-transparent px-2 py-2 text-dark-50 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-100">Plano Atual</label>
        <p className="mt-1 inline-block rounded-full bg-aguia-primary/10 px-3 py-1 text-sm font-medium text-aguia-primary">
          {org.plan}
        </p>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar Alterações"}
      </button>
    </div>
  );
}
