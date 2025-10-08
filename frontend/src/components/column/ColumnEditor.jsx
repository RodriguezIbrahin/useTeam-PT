// src/components/column/ColumnEditor.jsx
import React, { useState } from "react";

/**
 * Props:
 * - initial: { mode: 'create'|'edit', col?: { id, title } }
 * - onClose()
 * - onCreate(title)
 * - onUpdate(id, updates)
 * - onDelete(id)   <-- opcional, llamado cuando el usuario elimina la columna
 */
export default function ColumnEditor({
  initial,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const mode = initial?.mode || "create"; // 'create' | 'edit'
  const [title, setTitle] = useState(initial?.col?.title || "");
  const [busy, setBusy] = useState(false); // evita doble submit / doble delete
  const colTitle = initial?.col?.title || "";

  const submit = async () => {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      if (mode === "create") {
        console.log("[ColumnEditor] Creating column:", title.trim());
        await Promise.resolve(onCreate && onCreate(title.trim()));
      } else {
        console.log(
          "[ColumnEditor] Updating column:",
          initial.col.id,
          title.trim()
        );
        await Promise.resolve(
          onUpdate && onUpdate(initial.col.id, { title: title.trim() })
        );
      }
      // cerramos modal UNA vez, el padre puede controlar estado adicional
      onClose && onClose();
    } catch (err) {
      console.error("ColumnEditor submit error:", err);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || busy) return;
    setBusy(true);
    try {
      await Promise.resolve(onDelete(initial.col.id));
      onClose && onClose();
    } catch (err) {
      console.error("ColumnEditor delete error:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">
          {mode === "create" ? "Nueva columna" : `Editar columna "${colTitle}"`}
        </h3>

        <input
          className="w-full border border-gray-200 p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la columna"
          autoFocus
          disabled={busy}
        />

        <div
          className={`flex ${
            mode === "create" ? "justify-end" : "justify-between"
          } items-center gap-2`}
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                console.log("[ColumnEditor] Cancel clicked");
                onClose && onClose();
              }}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
              disabled={busy}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={submit}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              disabled={busy || !title.trim()}
            >
              {mode === "create" ? "Crear" : "Guardar"}
            </button>
          </div>

          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
              disabled={busy}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
