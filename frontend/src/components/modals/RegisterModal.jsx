import React, { useState, useEffect } from "react";

export default function RegisterModal({ open, onClose, onSave }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const e = localStorage.getItem("userEmail");
      const n = localStorage.getItem("userName");
      if (e) setEmail(e);
      if (n) setName(n);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    setError("");
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }
    localStorage.setItem("userEmail", email);
    if (name) localStorage.setItem("userName", name);
    onSave?.({ email, name });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-2 text-center">
          Bienvenido a useTeam
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Ingresa tu nombre y email para continuar. Esto se usará para
          notificaciones.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tu nombre (opcional)"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="tu@email.com"
          type="email"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
