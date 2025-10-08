// src/components/cards/Card.jsx
import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";

/**
 * Props:
 * - task
 * - index
 * - onEdit(task)
 * - onDelete(taskId)
 */
export default function Card({ task, index, onEdit, onDelete }) {
  const id = task.id || task._id || `t-${Date.now()}`;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    if (!onDelete || deleting) return;
    setDeleting(true);
    try {
      onDelete(id);
    } catch (err) {
      console.error("[Card] onDelete error:", err);
    } finally {
      // dejamos pequeño delay para evitar doble click inmediato
      setTimeout(() => setDeleting(false), 300);
    }
  };

  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-md mb-3 border border-gray-100 transition-transform ${
            snapshot.isDragging ? "scale-105 bg-gray-50" : ""
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="p-2 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 truncate">
                {task.title}
              </div>
              {task.description && (
                <div className="text-sm text-gray-500 mt-1 line-clamp-3">
                  {task.description}
                </div>
              )}
            </div>

            <div className="flex flex-row items-end gap-1 text-sm ml-3">
              <button
                onClick={() => onEdit && onEdit(task)}
                className="p-1 rounded hover:bg-gray-100 transition text-gray-600"
                aria-label="Editar tarjeta"
                title="Editar"
                type="button"
              >
                ✏️
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className={`p-1 rounded hover:bg-red-50 transition ${
                    deleting ? "opacity-60 pointer-events-none" : "text-red-600"
                  }`}
                  aria-label="Eliminar tarjeta"
                  title="Eliminar"
                  type="button"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
