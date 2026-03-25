"use client";

import { useState } from "react";
import { Plus, Zap, Play, Pause, Trash2, ChevronRight, Clock, ArrowRight, MoreHorizontal } from "lucide-react";
import { useOrg } from "@/providers/org-provider";

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  active: boolean;
  runsCount: number;
  lastRun: string | null;
}

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "a1",
    name: "Notificar equipe em tarefas atrasadas",
    description: "Quando uma tarefa passa do prazo, notifica o responsável e o gestor",
    trigger: "Tarefa atrasada",
    action: "Enviar notificação",
    active: true,
    runsCount: 47,
    lastRun: "2h atrás",
  },
  {
    id: "a2",
    name: "Mover tarefa para Review",
    description: "Quando o status muda para 'Concluído', mover para revisão do gestor",
    trigger: "Status alterado → Concluído",
    action: "Mover para Review",
    active: true,
    runsCount: 125,
    lastRun: "30min atrás",
  },
  {
    id: "a3",
    name: "Criar tarefa de onboarding",
    description: "Quando um novo membro entra, cria automaticamente tarefas de onboarding",
    trigger: "Novo membro adicionado",
    action: "Criar tarefas do template",
    active: false,
    runsCount: 8,
    lastRun: "5d atrás",
  },
  {
    id: "a4",
    name: "Relatório semanal automático",
    description: "Todo domingo às 20h, gera e envia relatório de progresso da semana",
    trigger: "Agendamento: Dom 20:00",
    action: "Gerar relatório + Email",
    active: true,
    runsCount: 12,
    lastRun: "2d atrás",
  },
];

const TEMPLATES = [
  { icon: "🔔", name: "Notificar responsável", desc: "Quando status muda, notificar pessoa atribuída" },
  { icon: "📋", name: "Criar sub-tarefas", desc: "Automaticamente criar sub-tarefas ao criar item" },
  { icon: "📊", name: "Relatório periódico", desc: "Enviar relatório de progresso por email" },
  { icon: "🔄", name: "Mover entre quadros", desc: "Mover item entre quadros baseado em condição" },
  { icon: "⏰", name: "Lembrete de prazo", desc: "Enviar lembrete X dias antes do prazo" },
  { icon: "👥", name: "Atribuir automaticamente", desc: "Atribuir tarefa baseado em departamento" },
];

export default function AutomationsPage() {
  const org = useOrg();
  const [automations, setAutomations] = useState(MOCK_AUTOMATIONS);
  const [showTemplates, setShowTemplates] = useState(false);

  const toggleActive = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Automações</h1>
          <p className="mt-1 text-sm text-dark-200">
            Automatize fluxos de trabalho e reduza trabalho manual
          </p>
        </div>
        <button onClick={() => setShowTemplates(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Nova Automação
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="stat-card p-4" style={{ "--card-accent": "#00D4AA" } as React.CSSProperties}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{automations.filter(a => a.active).length}</p>
              <p className="text-xs text-dark-200">Ativas</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4" style={{ "--card-accent": "#0EA5E9" } as React.CSSProperties}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10">
              <Play className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{automations.reduce((sum, a) => sum + a.runsCount, 0)}</p>
              <p className="text-xs text-dark-200">Execuções totais</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4" style={{ "--card-accent": "#8B5CF6" } as React.CSSProperties}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
              <Clock className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">~2h</p>
              <p className="text-xs text-dark-200">Tempo economizado/semana</p>
            </div>
          </div>
        </div>
      </div>

      {/* Automations list */}
      <div className="space-y-3">
        {automations.map((auto) => (
          <div key={auto.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${auto.active ? 'bg-aguia-primary/10' : 'bg-white/5'}`}>
                  <Zap className={`h-5 w-5 ${auto.active ? 'text-aguia-primary' : 'text-dark-400'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white truncate">{auto.name}</h3>
                  <p className="text-xs text-dark-200 truncate">{auto.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 ml-4">
                {/* Trigger → Action */}
                <div className="hidden lg:flex items-center gap-2 text-xs text-dark-300">
                  <span className="rounded-md px-2 py-1 bg-white/5">{auto.trigger}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="rounded-md px-2 py-1 bg-white/5">{auto.action}</span>
                </div>

                {/* Runs */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-dark-100">{auto.runsCount} execuções</p>
                  {auto.lastRun && <p className="text-[10px] text-dark-400">Última: {auto.lastRun}</p>}
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleActive(auto.id)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    auto.active ? "bg-aguia-primary" : "bg-dark-500"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      auto.active ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>

                <button className="rounded p-1.5 text-dark-400 hover:bg-white/5 hover:text-dark-200">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Templates modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-white">Escolha um Template</h2>
            <p className="mt-1 text-sm text-dark-200">
              Selecione um template para começar ou crie do zero
            </p>

            <div className="mt-4 space-y-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  onClick={() => setShowTemplates(false)}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="text-xl">{tpl.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{tpl.name}</p>
                    <p className="text-xs text-dark-200">{tpl.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-dark-400" />
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowTemplates(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
