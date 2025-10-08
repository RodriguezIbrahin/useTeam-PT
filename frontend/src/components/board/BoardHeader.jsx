import React from "react";

export default function BoardHeader({ boardName, connected, saving }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/90 border-b shadow-sm">
      {/* Nombre del tablero */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        {boardName}
      </h1>

      {/* Estado de conexión y guardado */}
      <div className="text-sm text-gray-600 flex items-center gap-4">
        {connected ? (
          <span className="flex items-center gap-1">🟢 En línea</span>
        ) : (
          <span className="flex items-center gap-1">🔴 Sin conexión</span>
        )}
        {saving && <span className="text-blue-600">• Guardando...</span>}
      </div>
    </div>
  );
}
