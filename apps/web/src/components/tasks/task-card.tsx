"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageSquare, Clock } from "lucide-react";
import { cn } from "@aguia/ui";

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "#EF4444",
  HIGH: "#F97316",
  MEDIUM: "#0EA5E9",
  LOW: "#64748B",
};

export interface TaskData {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: { displayName: string; avatarUrl: string | null } | null;
  labels: { id: string; name: string; color: string }[];
  commentCount: number;
  dueDate: string | null;
}

interface TaskCardProps {
  task: TaskData;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeftColor: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM,
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE" &&
    task.status !== "CANCELLED";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "glass-card cursor-pointer border-l-[3px] p-3 transition-all hover:bg-white/[0.08]",
        isDragging && "opacity-50"
      )}
    >
      <p className="text-sm font-medium text-dark-50 line-clamp-2">{task.title}</p>

      {task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="rounded px-1.5 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: `${label.color}25`, color: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.assignee && (
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold"
              style={{ background: "linear-gradient(135deg, var(--aguia-primary), var(--aguia-secondary))", color: "#0B1120" }}
              title={task.assignee.displayName}
            >
              {task.assignee.displayName[0]}
            </div>
          )}

          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-1 text-[11px]",
                isOverdue ? "font-medium text-red-400" : "text-dark-300"
              )}
            >
              <Clock className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>

        {task.commentCount > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-dark-300">
            <MessageSquare className="h-3 w-3" />
            {task.commentCount}
          </span>
        )}
      </div>
    </div>
  );
}
