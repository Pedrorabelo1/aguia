"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@aguia/ui";

interface KanbanColumnProps {
  id: string;
  label: string;
  color: string;
  count: number;
  children: React.ReactNode;
}

export function KanbanColumn({ id, label, color, count, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 flex-shrink-0 flex-col rounded-xl transition-colors",
        isOver ? "bg-white/[0.06] ring-2 ring-aguia-primary/30" : "bg-white/[0.02]"
      )}
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-sm font-semibold text-dark-50">{label}</h3>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-dark-200">
          {count}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-2 scrollbar-thin">
        {children}
      </div>
    </div>
  );
}
