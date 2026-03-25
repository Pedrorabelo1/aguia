"use client";

import { useState } from "react";
import { Plus, GitBranch, Play, MoreHorizontal } from "lucide-react";
import { useOrg } from "@/providers/org-provider";
import Link from "next/link";

interface ProcessTemplate {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  isPublished: boolean;
  version: number;
  stepsCount: number;
  instancesCount: number;
}

const MOCK_PROCESSES: ProcessTemplate[] = [
  {
    id: "p1",
    name: "Onboarding de Funcionário",
    description: "Processo completo de integração de novos colaboradores",
    icon: null,
    color: "#8B5CF6",
    isPublished: true,
    version: 3,
    stepsCount: 8,
    instancesCount: 12,
  },
  {
    id: "p2",
    name: "Aprovação de Compras",
    description: "Fluxo de aprovação para solicitações de compra acima de R$1.000",
    icon: null,
    color: "#3B82F6",
    isPublished: true,
    version: 2,
    stepsCount: 5,
    instancesCount: 34,
  },
  {
    id: "p3",
    name: "Revisão de Código",
    description: "Processo de code review para pull requests",
    icon: null,
    color: "#10B981",
    isPublished: false,
    version: 1,
    stepsCount: 4,
    instancesCount: 0,
  },
  {
    id: "p4",
    name: "Ciclo de Feedback",
    description: "Avaliação de desempenho trimestral",
    icon: null,
    color: "#F59E0B",
    isPublished: true,
    version: 1,
    stepsCount: 6,
    instancesCount: 8,
  },
];

export default function ProcessesPage() {
  const org = useOrg();
  const [processes] = useState(MOCK_PROCESSES);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mapa de Processos</h1>
          <p className="text-sm text-gray-500">
            {processes.length} templates de processo
          </p>
        </div>
        <Link
          href={`/${org.slug}/processes/new`}
          className="flex items-center gap-2 rounded-lg bg-aguia-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Novo Processo
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {processes.map((process) => (
          <Link
            key={process.id}
            href={`/${org.slug}/processes/${process.id}`}
            className="group rounded-xl border bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: process.color }}
              >
                <GitBranch className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                {process.isPublished ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Publicado
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                    Rascunho
                  </span>
                )}
              </div>
            </div>

            <h3 className="mt-3 font-semibold text-gray-900">{process.name}</h3>
            {process.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {process.description}
              </p>
            )}

            <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
              <span>{process.stepsCount} etapas</span>
              <span>{process.instancesCount} execuções</span>
              <span>v{process.version}</span>
            </div>

            {/* Mini progress bar */}
            <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: process.color,
                  width: process.isPublished ? "100%" : "60%",
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
