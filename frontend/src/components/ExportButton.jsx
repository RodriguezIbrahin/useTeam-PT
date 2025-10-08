// src/components/ExportButton.jsx
import React, { useState } from "react";

/**
 * ExportButton
 * - fondo blanco / gris claro por defecto
 * - al hover se rellena (bg oscuro) y cambia a texto blanco
 * - accesibilidad: aria-busy, aria-disabled, title
 * - muestra spinner cuando loading
 */
export default function ExportButton({
  onExport,
  children = "Exportar backlog",
  className = "",
  title,
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (typeof onExport !== "function") {
      console.warn("ExportButton: onExport no es una función");
      return;
    }
    setLoading(true);
    try {
      await onExport();
    } catch (err) {
      console.error("ExportButton -> onExport error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
      aria-disabled={loading}
      title={title || children}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-150
        bg-white border border-gray-200 text-gray-800
        ${
          loading
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-gray-800 hover:text-white hover:shadow-md"
        }
        ${className}`}
    >
      {/* download icon (visible cuando no está cargando) */}
      {!loading && (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v12M5 10l7 7 7-7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 21h14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* spinner */}
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.25"
          />
          <path
            d="M22 12a10 10 0 00-10-10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}

      <span className="whitespace-nowrap">
        {loading ? "Enviando..." : children}
      </span>
    </button>
  );
}
