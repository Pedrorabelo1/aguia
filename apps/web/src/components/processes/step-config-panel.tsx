"use client";

import { X } from "lucide-react";
import type { Node } from "@xyflow/react";

const STEP_TYPES = [
  { value: "TASK", label: "Tarefa" },
  { value: "APPROVAL", label: "Aprovação" },
  { value: "NOTIFICATION", label: "Notificação" },
  { value: "CONDITION", label: "Condição" },
  { value: "SUBPROCESS", label: "Subprocesso" },
  { value: "WAIT", label: "Espera" },
];

const ASSIGNEE_ROLES = [
  { value: "", label: "Sem atribuição padrão" },
  { value: "OWNER", label: "Dono da Org" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Gerente" },
  { value: "MEMBER", label: "Membro" },
];

interface StepConfigPanelProps {
  node: Node;
  onUpdate: (data: Record<string, unknown>) => void;
  onClose: () => void;
}

export function StepConfigPanel({ node, onUpdate, onClose }: StepConfigPanelProps) {
  const data = node.data as Record<string, unknown>;

  return (
    <div className="w-80 border-l bg-white overflow-y-auto">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Configurar Etapa</h3>
        <button
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-500">Nome</label>
          <input
            type="text"
            value={(data.label as string) || ""}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-aguia-primary focus:outline-none focus:ring-1 focus:ring-aguia-primary"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-gray-500">Tipo</label>
          <select
            value={(data.stepType as string) || "TASK"}
            onChange={(e) => onUpdate({ stepType: e.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            {STEP_TYPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-500">
            Descrição
          </label>
          <textarea
            value={(data.description as string) || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-aguia-primary focus:outline-none focus:ring-1 focus:ring-aguia-primary"
            placeholder="Descreva o que deve ser feito nesta etapa..."
          />
        </div>

        {/* Default Assignee Role */}
        <div>
          <label className="block text-xs font-medium text-gray-500">
            Responsável Padrão
          </label>
          <select
            value={(data.defaultAssigneeRole as string) || ""}
            onChange={(e) =>
              onUpdate({ defaultAssigneeRole: e.target.value || null })
            }
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            {ASSIGNEE_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Minutes */}
        <div>
          <label className="block text-xs font-medium text-gray-500">
            Tempo Estimado (minutos)
          </label>
          <input
            type="number"
            min="0"
            value={(data.estimatedMinutes as number) || ""}
            onChange={(e) =>
              onUpdate({
                estimatedMinutes: e.target.value
                  ? parseInt(e.target.value)
                  : null,
              })
            }
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="30"
          />
        </div>

        {/* Days from Start */}
        <div>
          <label className="block text-xs font-medium text-gray-500">
            Dias após início do processo
          </label>
          <input
            type="number"
            min="0"
            value={(data.daysFromStart as number) || ""}
            onChange={(e) =>
              onUpdate({
                daysFromStart: e.target.value
                  ? parseInt(e.target.value)
                  : null,
              })
            }
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="0"
          />
        </div>

        {/* Required toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-500">Obrigatório</label>
          <button
            onClick={() => onUpdate({ isRequired: !data.isRequired })}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              data.isRequired ? "bg-aguia-primary" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                data.isRequired ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Condition-specific config */}
        {(data.stepType as string) === "CONDITION" && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <p className="text-xs font-medium text-orange-700">
              Nó de Condição
            </p>
            <p className="mt-1 text-xs text-orange-600">
              Use as saídas verde (Sim) e vermelha (Não) para criar bifurcações
              no fluxo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
