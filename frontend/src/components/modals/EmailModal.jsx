// src/components/EmailModal.jsx
import React, { useState, useEffect } from "react";

export default function EmailModal({
  initialEmail = "",
  onClose,
  onSubmit,
  loading = false, // prop from parent (optional)
}) {
  const [email, setEmail] = useState(initialEmail || "");
  const [sendCopy, setSendCopy] = useState(false);
  const [valid, setValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // interno para evitar doble envío
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setEmail(initialEmail || "");
  }, [initialEmail, setEmail]);

  useEffect(() => {
    const ok = /\S+@\S+\.\S+/.test(email);
    setValid(ok);
    if (errorMsg && ok) setErrorMsg("");
  }, [email, errorMsg]);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setSendCopy(Boolean(userEmail));
  }, [initialEmail]);

  // manejar submit: await onSubmit para que el padre controle la exportación
  const handleSubmit = async () => {
    if (!valid || isSubmitting || loading) return;
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      const notifyEmail = localStorage.getItem("userEmail") || null;
      await onSubmit({
        email,
        notifyCopy: sendCopy,
        notifyEmail,
      });

      // mostrar un pequeño mensaje dentro del modal (el padre normalmente cerrará el modal)
      setSuccessMsg("Exportación solicitada. Cerrando...");
      // no cerramos aquí: el padre (Board) cierra la modal cuando su promesa termina
    } catch (err) {
      console.error("EmailModal onSubmit error:", err);
      setErrorMsg(err?.message || "Error al solicitar exportación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && valid && !isSubmitting && !loading) {
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose?.();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Exportar backlog</h3>
        <p className="text-sm text-gray-600 mb-4">
          Introducí el correo del destinatario. Podés optar por recibir una
          copia.
        </p>

        <label className="block text-sm font-medium mb-1">
          Email destinatario
        </label>
        <input
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-200 bg-white text-gray-900 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="destinatario@ejemplo.com"
          type="email"
          aria-label="Email destinatario"
          disabled={isSubmitting || loading}
        />

        <div className="flex items-center gap-3 mb-4">
          <input
            id="sendCopy"
            type="checkbox"
            checked={sendCopy}
            onChange={(e) => setSendCopy(e.target.checked)}
            className="h-4 w-4"
            disabled={isSubmitting || loading}
          />
          <label htmlFor="sendCopy" className="text-sm">
            Recibirme una copia (se enviará al correo registrado)
          </label>
        </div>

        {errorMsg && (
          <div className="text-sm text-red-600 mb-3" role="alert">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="text-sm text-green-600 mb-3" role="status">
            {successMsg}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded border bg-gray-50"
            onClick={onClose}
            disabled={isSubmitting || loading}
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={!valid || isSubmitting || loading}
            className={`px-3 py-1 rounded text-white inline-flex items-center gap-2 ${
              isSubmitting || loading
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            aria-disabled={isSubmitting || loading || !valid}
          >
            {(isSubmitting || loading) && (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  opacity="0.25"
                />
                <path
                  d="M22 12a10 10 0 00-10-10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span>
              {isSubmitting || loading ? "Enviando..." : "Solicitar export"}
            </span>
          </button>
        </div>

        {!valid && email.length > 0 && (
          <div className="text-sm text-red-500 mt-3">
            Ingresá un email válido
          </div>
        )}
      </div>
    </div>
  );
}
