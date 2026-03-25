"use client";

import { useState } from "react";

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationGroup {
  title: string;
  settings: NotificationSetting[];
}

const INITIAL_GROUPS: NotificationGroup[] = [
  {
    title: "Tarefas",
    settings: [
      {
        key: "task_assigned",
        label: "Tarefa atribuída",
        description: "Quando uma tarefa for atribuída a você",
        enabled: true,
      },
      {
        key: "task_commented",
        label: "Comentário em tarefa",
        description: "Quando alguém comentar em uma tarefa sua",
        enabled: true,
      },
      {
        key: "task_status_changed",
        label: "Mudança de status",
        description: "Quando o status de uma tarefa sua mudar",
        enabled: false,
      },
      {
        key: "task_due_date",
        label: "Prazo próximo",
        description: "Quando uma tarefa sua estiver perto do prazo",
        enabled: true,
      },
      {
        key: "task_mentioned",
        label: "Menção em tarefa",
        description: "Quando você for mencionado em uma tarefa",
        enabled: true,
      },
    ],
  },
  {
    title: "Processos",
    settings: [
      {
        key: "process_activated",
        label: "Processo ativado",
        description: "Quando um processo for ativado para você",
        enabled: true,
      },
      {
        key: "process_step_completed",
        label: "Etapa concluída",
        description: "Quando uma etapa do processo for concluída",
        enabled: false,
      },
      {
        key: "process_completed",
        label: "Processo concluído",
        description: "Quando um processo inteiro for finalizado",
        enabled: true,
      },
    ],
  },
  {
    title: "Equipe",
    settings: [
      {
        key: "member_joined",
        label: "Novo membro",
        description: "Quando um novo membro entrar na organização",
        enabled: false,
      },
      {
        key: "member_left",
        label: "Membro saiu",
        description: "Quando um membro sair da organização",
        enabled: false,
      },
    ],
  },
  {
    title: "Sistema",
    settings: [
      {
        key: "weekly_digest",
        label: "Resumo semanal",
        description: "Receba um resumo semanal das atividades",
        enabled: true,
      },
      {
        key: "security_alerts",
        label: "Alertas de segurança",
        description: "Login de novos dispositivos ou atividade suspeita",
        enabled: true,
      },
    ],
  },
];

export default function SettingsNotificationsPage() {
  const [groups, setGroups] = useState<NotificationGroup[]>(INITIAL_GROUPS);
  const [saving, setSaving] = useState(false);

  const toggleSetting = (groupIndex: number, settingIndex: number) => {
    setGroups((prev) =>
      prev.map((group, gi) =>
        gi === groupIndex
          ? {
              ...group,
              settings: group.settings.map((s, si) =>
                si === settingIndex ? { ...s, enabled: !s.enabled } : s
              ),
            }
          : group
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: API call to save notification preferences
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Notificações</h2>
        <p className="text-sm text-gray-500">Configure quais notificações você deseja receber</p>
      </div>

      <div className="space-y-8">
        {groups.map((group, gi) => (
          <div key={group.title}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{group.title}</h3>
            <div className="rounded-lg border bg-white shadow-sm divide-y">
              {group.settings.map((setting, si) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => toggleSetting(gi, si)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-aguia-primary focus:ring-offset-2 ${
                      setting.enabled ? "bg-aguia-primary" : "bg-gray-200"
                    }`}
                    role="switch"
                    aria-checked={setting.enabled}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        setting.enabled ? "translate-x-5" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-aguia-primary px-6 py-2 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? "Salvando..." : "Salvar Preferências"}
        </button>
      </div>
    </div>
  );
}
