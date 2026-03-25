"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";

const COLUMNS = [
  { id: "TODO", label: "A Fazer", color: "#6B7280" },
  { id: "IN_PROGRESS", label: "Em Andamento", color: "#3B82F6" },
  { id: "IN_REVIEW", label: "Em Revisao", color: "#F59E0B" },
  { id: "BLOCKED", label: "Bloqueado", color: "#EF4444" },
  { id: "DONE", label: "Concluido", color: "#10B981" },
  { id: "CANCELLED", label: "Cancelado", color: "#9CA3AF" },
];

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: { displayName: string; avatarUrl: string | null } | null;
  labels: { id: string; name: string; color: string }[];
  commentCount: number;
  dueDate: string | null;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (id: string) => void;
  onTaskMove: (taskId: string, newStatus: string) => void;
  onTaskReorder: (taskId: string, newStatus: string, newIndex: number) => void;
}

export function KanbanBoard({
  tasks,
  onTaskClick,
  onTaskMove,
  onTaskReorder,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);

    // Check if dropped on a column
    const targetColumn = COLUMNS.find((col) => col.id === overId);
    if (targetColumn) {
      onTaskMove(taskId, targetColumn.id);
      return;
    }

    // Dropped on another task - find that task's column
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      const columnTasks = tasks.filter((t) => t.status === overTask.status);
      const overIndex = columnTasks.findIndex((t) => t.id === overId);
      onTaskReorder(taskId, overTask.status, overIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              label={column.label}
              color={column.color}
              count={columnTasks.length}
            >
              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick(task.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
