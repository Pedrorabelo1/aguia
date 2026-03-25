"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  CheckSquare,
  ThumbsUp,
  Bell,
  GitBranch,
  Layers,
  Clock,
} from "lucide-react";
import { cn } from "@aguia/ui";

const STEP_ICONS: Record<string, React.ElementType> = {
  TASK: CheckSquare,
  APPROVAL: ThumbsUp,
  NOTIFICATION: Bell,
  CONDITION: GitBranch,
  SUBPROCESS: Layers,
  WAIT: Clock,
};

const STEP_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  TASK: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  APPROVAL: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  NOTIFICATION: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  CONDITION: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  SUBPROCESS: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
  WAIT: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" },
};

interface FlowNodeData {
  label: string;
  stepType: string;
  description?: string;
  isRequired?: boolean;
  estimatedMinutes?: number;
  [key: string]: unknown;
}

function FlowNodeComponent({ data, selected }: NodeProps<Record<string, unknown> & { label: string; stepType: string; description?: string; isRequired?: boolean; estimatedMinutes?: number }>) {
  const stepType = (data.stepType as string) || "TASK";
  const Icon = STEP_ICONS[stepType] || CheckSquare;
  const colors = STEP_COLORS[stepType] || STEP_COLORS.TASK;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-white !bg-gray-400"
      />

      <div
        className={cn(
          "min-w-[180px] rounded-xl border-2 px-4 py-3 shadow-sm transition-shadow",
          colors.bg,
          colors.border,
          selected && "ring-2 ring-aguia-primary ring-offset-2 shadow-md"
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn("rounded-lg p-1.5", colors.text)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {data.label || "Nova Etapa"}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              {stepType}
            </p>
          </div>
        </div>

        {data.description && (
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">
            {data.description as string}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
          {data.estimatedMinutes && (
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {data.estimatedMinutes as number}min
            </span>
          )}
          {data.isRequired && (
            <span className="rounded bg-red-100 px-1 py-0.5 text-red-600 font-medium">
              Obrigatório
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-white !bg-gray-400"
      />

      {/* Extra handle for condition nodes */}
      {stepType === "CONDITION" && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="yes"
            className="!h-3 !w-3 !border-2 !border-white !bg-green-500"
          />
          <Handle
            type="source"
            position={Position.Left}
            id="no"
            className="!h-3 !w-3 !border-2 !border-white !bg-red-500"
          />
        </>
      )}
    </>
  );
}

export const FlowNode = memo(FlowNodeComponent);
