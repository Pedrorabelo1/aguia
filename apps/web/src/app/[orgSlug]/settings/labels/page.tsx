"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Label {
  id: string;
  name: string;
  color: string;
}

const INITIAL_LABELS: Label[] = [
  { id: "1", name: "Bug", color: "#EF4444" },
  { id: "2", name: "Feature", color: "#3B82F6" },
  { id: "3", name: "Urgente", color: "#F59E0B" },
  { id: "4", name: "Melhoria", color: "#8B5CF6" },
  { id: "5", name: "Documentação", color: "#10B981" },
];

const PRESET_COLORS = [
  "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
  "#EC4899", "#F97316", "#14B8A6", "#6366F1", "#A855F7",
  "#E11D48", "#84CC16", "#06B6D4", "#2563EB", "#7C3AED",
];

export default function SettingsLabelsPage() {
  const [labels, setLabels] = useState<Label[]>(INITIAL_LABELS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#3B82F6");

  const startEdit = (label: Label) => {
    setEditingId(label.id);
    setEditName(label.name);
    setEditColor(label.color);
  };

  const saveEdit = () => {
    if (!editName.trim() || !editingId) return;
    setLabels((prev) =>
      prev.map((l) => (l.id === editingId ? { ...l, name: editName, color: editColor } : l))
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    setLabels((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName, color: newColor },
    ]);
    setNewName("");
    setNewColor("#3B82F6");
    setShowNew(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Labels</h2>
          <p className="text-sm text-gray-500">Crie e gerencie labels para categorizar tarefas</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 rounded-lg bg-aguia-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Nova Label
        </button>
      </div>

      {/* New Label Form */}
      {showNew && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border p-0.5"
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Nome da label"
            autoFocus
            className="flex-1 rounded-lg border px-3 py-1.5 text-sm focus:border-aguia-primary focus:outline-none focus:ring-1 focus:ring-aguia-primary"
          />
          <div className="flex gap-3 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  borderColor: newColor === c ? "#1F2937" : "transparent",
                }}
              />
            ))}
          </div>
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="rounded-md bg-aguia-primary p-1.5 text-white hover:opacity-90 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowNew(false)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Labels List */}
      <div className="space-y-2">
        {labels.map((label) => (
          <div
            key={label.id}
            className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm"
          >
            {editingId === label.id ? (
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border p-0.5"
                />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  autoFocus
                  className="flex-1 rounded-lg border px-3 py-1.5 text-sm focus:border-aguia-primary focus:outline-none focus:ring-1 focus:ring-aguia-primary"
                />
                <button
                  onClick={saveEdit}
                  className="rounded-md bg-aguia-primary p-1.5 text-white hover:opacity-90"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{label.color}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(label)}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(label.id)}
                    className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {labels.length === 0 && (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <p className="text-sm text-gray-500">Nenhuma label criada ainda.</p>
            <button
              onClick={() => setShowNew(true)}
              className="mt-2 text-sm font-medium text-aguia-primary hover:underline"
            >
              Criar primeira label
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
