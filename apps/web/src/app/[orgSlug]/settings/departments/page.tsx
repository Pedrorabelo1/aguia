"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Users } from "lucide-react";

interface Department {
  id: string;
  name: string;
  color: string;
  icon: string;
  memberCount: number;
}

const INITIAL_DEPARTMENTS: Department[] = [
  { id: "1", name: "Engenharia", color: "#3B82F6", icon: "code", memberCount: 12 },
  { id: "2", name: "Design", color: "#8B5CF6", icon: "palette", memberCount: 5 },
  { id: "3", name: "Marketing", color: "#F59E0B", icon: "megaphone", memberCount: 8 },
  { id: "4", name: "Vendas", color: "#10B981", icon: "trending-up", memberCount: 15 },
];

interface DepartmentFormData {
  name: string;
  color: string;
  icon: string;
}

export default function SettingsDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DepartmentFormData>({ name: "", color: "#3B82F6", icon: "" });

  const resetForm = () => {
    setForm({ name: "", color: "#3B82F6", icon: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (dept: Department) => {
    setForm({ name: dept.name, color: dept.color, icon: dept.icon });
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (editingId) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingId ? { ...d, name: form.name, color: form.color, icon: form.icon } : d
        )
      );
    } else {
      const newDept: Department = {
        id: Date.now().toString(),
        name: form.name,
        color: form.color,
        icon: form.icon,
        memberCount: 0,
      };
      setDepartments((prev) => [...prev, newDept]);
    }
    resetForm();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Departamentos</h2>
          <p className="text-sm text-gray-500">Organize sua equipe em departamentos</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-aguia-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Novo Departamento
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">
              {editingId ? "Editar Departamento" : "Novo Departamento"}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Engenharia"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-aguia-primary focus:outline-none focus:ring-1 focus:ring-aguia-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cor</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="h-9 w-9 cursor-pointer rounded border p-0.5"
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono uppercase"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ícone</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="Ex: code, palette"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-aguia-primary focus:outline-none focus:ring-1 focus:ring-aguia-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={resetForm}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.name.trim()}
              className="rounded-lg bg-aguia-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {editingId ? "Salvar" : "Criar"}
            </button>
          </div>
        </div>
      )}

      {/* Department List */}
      <div className="space-y-2">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: dept.color }}
              >
                {dept.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{dept.name}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{dept.memberCount} membros</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleEdit(dept)}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(dept.id)}
                className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {departments.length === 0 && (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <p className="text-sm text-gray-500">Nenhum departamento criado ainda.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-sm font-medium text-aguia-primary hover:underline"
            >
              Criar primeiro departamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
