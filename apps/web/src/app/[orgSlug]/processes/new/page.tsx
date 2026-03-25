"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrg } from "@/providers/org-provider";
import { ProcessEditor } from "@/components/processes/process-editor";
import type { Node, Edge } from "@xyflow/react";

export default function NewProcessPage() {
  const org = useOrg();
  const router = useRouter();
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border">
          <h1 className="text-xl font-bold">Novo Processo</h1>
          <p className="mt-1 text-sm text-gray-500">
            Dê um nome ao seu processo antes de começar a desenhar o fluxo
          </p>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Nome do Processo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Onboarding de Funcionário"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-aguia-primary focus:outline-none focus:ring-1 focus:ring-aguia-primary"
              autoFocus
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => name.trim() && setStarted(true)}
              disabled={!name.trim()}
              className="rounded-lg bg-aguia-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Começar a Desenhar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-6 h-[calc(100vh-4rem)]">
      <ProcessEditor
        processName={name}
        onSave={(nodes, edges) => {
          console.log("Saving process:", { name, nodes, edges });
          // TODO: API call to save
        }}
        onActivate={() => {
          console.log("Activating process:", name);
          // TODO: API call to activate
        }}
      />
    </div>
  );
}
