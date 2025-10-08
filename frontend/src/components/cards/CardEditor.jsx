import React, { useState } from "react";

/**
 * Props:
 * - initial: { mode: 'create'|'edit', columnId, task? }
 * - onClose()
 * - onCreate(columnId, payload)
 * - onUpdate(columnId, taskId, payload)
 * - onDelete(columnId, taskId)  <-- opcional
 */
export default function CardEditor({
  initial,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const mode = initial?.mode || "create";
  const colId = initial?.columnId;
  const task = initial?.task || {};
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const payload = {
        id: task?.id || `t-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        createdAt: task?.createdAt || new Date().toISOString(),
      };

      if (mode === "create") {
        console.log("[CardEditor] create card", colId, payload);
        await Promise.resolve(onCreate && onCreate(colId, payload));
      } else {
        console.log("[CardEditor] update card", colId, task.id, payload);
        await Promise.resolve(onUpdate && onUpdate(colId, task.id, payload));
      }

      onClose && onClose();
    } catch (err) {
      console.error("CardEditor submit error:", err);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || busy) return;
    setBusy(true);
    try {
      await Promise.resolve(onDelete(colId, task.id));
      onClose && onClose();
    } catch (err) {
      console.error("CardEditor delete error:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-md w-full max-w-lg p-5">
        <h3 className="text-lg font-medium mb-3">
          {mode === "create" ? "Nueva tarjeta" : "Editar tarjeta"}
        </h3>

        <input
          className="w-full border border-gray-200 p-2 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          disabled={busy}
        />

        <textarea
          className="w-full border border-gray-200 p-2 rounded mb-4"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          disabled={busy}
        />

        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 items-center">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
              disabled={busy}
              type="button"
            >
              Cancelar
            </button>

            <button
              onClick={submit}
              className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={busy || !title.trim()}
              type="button"
            >
              {mode === "create" ? "Crear" : "Guardar"}
            </button>
          </div>

          {mode === "edit" && onDelete && (
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
              disabled={busy}
              type="button"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
