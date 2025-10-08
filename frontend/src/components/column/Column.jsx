// src/components/column/Column.jsx
import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import Card from "../cards/Card";

export default function Column({
  column,
  onEditColumn,
  onCreateCard,
  onEditCard,
  onDeleteColumn,
  onDeleteCard, // NUEVO: callback(columnId, taskId) provisto por Board
}) {
  const [deletingColumn, setDeletingColumn] = useState(false);

  const handleDeleteColumnClick = async () => {
    if (!onDeleteColumn || deletingColumn) return;
    setDeletingColumn(true);
    try {
      await onDeleteColumn(column.id); // Board se encarga de confirm + persist
    } catch (err) {
      console.error("[Column] onDeleteColumn error:", err);
    } finally {
      setDeletingColumn(false);
    }
  };

  return (
    <div className="flex-1 min-w-[220px] max-w-[420px] bg-white p-4 rounded-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {column.title}
          </h3>
          <div className="text-xs text-gray-500 mt-1">
            {(column.tasks || []).length} tarjeta
            {(column.tasks || []).length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Actions: horizontal, minimal */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateCard}
            title="Agregar tarjeta"
            aria-label={`Agregar tarjeta a ${column.title}`}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={onEditColumn}
            title="Editar columna"
            aria-label={`Editar ${column.title}`}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 21l3-1 11-11 1-3-3 1-11 11L3 21z"
                stroke="#111827"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={handleDeleteColumnClick}
            title="Eliminar columna"
            aria-label={`Eliminar ${column.title}`}
            className="p-2 rounded-md hover:bg-red-50 transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"
                stroke="#ef4444"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[120px] p-1 rounded-md transition-colors ${
              snapshot.isDraggingOver ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex flex-col gap-2">
              {(column.tasks || []).map((task, idx) => (
                <Card
                  key={task.id || task._id || `${column.id}-${idx}`}
                  task={task}
                  index={idx}
                  onEdit={() => onEditCard(task)}
                  onDelete={(taskId) => onDeleteCard && onDeleteCard(taskId)} // pasa sólo el id; Board maneja confirm
                />
              ))}
            </div>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
