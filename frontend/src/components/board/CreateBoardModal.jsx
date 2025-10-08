import React, { useState } from "react";

export default function CreateBoardModal({
  open,
  onClose,
  onCreate,
  initialTitle = "",
}) {
  const [title, setTitle] = useState(initialTitle);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim()) return alert("El título es requerido");
    setLoading(true);
    try {
      await onCreate({
        title: title.trim(),
        ownerEmail: email.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error("Create board error", err);
      alert("Error creando tablero: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-3">Crear nuevo tablero</h3>
        <label className="block text-sm mb-1">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          placeholder="Proyecto X"
          autoFocus
        />
        <label className="block text-sm mb-1">
          Email responsable (opcional)
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          placeholder="responsable@example.com"
          type="email"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1 rounded border"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
