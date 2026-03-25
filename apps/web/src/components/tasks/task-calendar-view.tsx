"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@aguia/ui";
import type { TaskData } from "./task-card";

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "#EF4444",
  HIGH: "#F97316",
  MEDIUM: "#0EA5E9",
  LOW: "#64748B",
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface TaskCalendarViewProps {
  tasks: TaskData[];
  onTaskClick: (id: string) => void;
}

export function TaskCalendarView({ tasks, onTaskClick }: TaskCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }
    return days;
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, TaskData[]> = {};
    tasks.forEach((task) => {
      if (task.dueDate) {
        const key = task.dueDate.slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(task);
      }
    });
    return map;
  }, [tasks]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 className="text-lg font-semibold text-white">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="rounded-lg p-1.5 hover:bg-white/5 text-dark-200">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="btn-secondary !py-1 !text-xs">
            Hoje
          </button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="rounded-lg p-1.5 hover:bg-white/5 text-dark-200">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-xs font-medium text-dark-300">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day, i) => {
          const dateKey = day.date.toISOString().slice(0, 10);
          const dayTasks = tasksByDate[dateKey] || [];
          const isToday = dateKey === today;

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] p-1",
                !day.isCurrentMonth && "opacity-30"
              )}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="flex justify-end">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                    isToday ? "bg-aguia-primary text-dark-900 font-bold" : "text-dark-200"
                  )}
                >
                  {day.date.getDate()}
                </span>
              </div>
              <div className="mt-1 space-y-0.5">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick(task.id)}
                    className="w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium"
                    style={{
                      backgroundColor: `${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM}25`,
                      color: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM,
                    }}
                    title={task.title}
                  >
                    {task.title}
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <p className="text-center text-[10px] text-dark-400">
                    +{dayTasks.length - 3} mais
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
