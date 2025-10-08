// src/components/board/Board.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { fetchBoard, saveBoard, sendExport } from "../../services/api";
import useSocket from "../../hooks/useSocket";
import Column from "../column/Column";
import { DragDropContext } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import ColumnEditor from "../column/ColumnEditor";
import CardEditor from "../cards/CardEditor";
import ExportButton from "../ExportButton";
import BoardHeader from "../board/BoardHeader";
import useConfirmToast from "../../hooks/useConfirmToast";
import EmailModal from "../modals/EmailModal";

/* Icons */
import {
  FiPlus,
  FiRefreshCw,
  FiDownload,
  FiSlash,
  FiCheckCircle,
} from "react-icons/fi";

export default function Board({ boardId }) {
  const [board, setBoard] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [confirm, ConfirmModalElement] = useConfirmToast();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // sets para bloquear re-entradas
  const pendingDeleteCards = useRef(new Set());
  const pendingDeleteColumns = useRef(new Set());

  const initialUserEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail") || ""
      : "";

  const handleBoardReceived = useCallback((b) => {
    console.log(
      "[WS] board received via socket ->",
      b?._id || b?.id || "unknown"
    );
    setBoard(b);
  }, []);

  const { emitBoardChange, connected } = useSocket({
    boardId,
    onBoard: handleBoardReceived,
  });

  // load board
  useEffect(() => {
    let mounted = true;
    setError(null);
    console.log("[Board] fetching board", boardId);
    fetchBoard(boardId)
      .then((b) => {
        if (!mounted) return;
        console.log("[Board] board fetched:", b?._id || "no-id");
        setBoard(b);
      })
      .catch((err) => {
        console.error("[Board] fetchBoard error:", err);
        setError(err.message || String(err));
        toast.error("Error al cargar el tablero");
      });
    return () => (mounted = false);
  }, [boardId]);

  // persist
  const persist = async (newBoard) => {
    try {
      setSaving(true);
      console.log("[Board] persisting board...", newBoard._id || boardId);
      await saveBoard(boardId, newBoard);
      console.log("[Board] persist OK");
    } catch (err) {
      console.error("[Board] saveBoard error:", err);
      toast.error("Error al guardar el tablero");
    } finally {
      setSaving(false);
    }
  };
  const debouncedPersist = useCallback(debounce(persist, 1000), [boardId]);

  // drag & drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newBoard = JSON.parse(JSON.stringify(board));
    const fromCol = newBoard.columns.find((c) => c.id === source.droppableId);
    const toCol = newBoard.columns.find(
      (c) => c.id === destination.droppableId
    );
    if (!fromCol || !toCol) return;
    const [moved] = fromCol.tasks.splice(source.index, 1);
    toCol.tasks.splice(destination.index, 0, moved);
    setBoard(newBoard);
    emitBoardChange(newBoard);
    debouncedPersist(newBoard);
  };

  // columnas
  const createColumn = async (title) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const id = `col-${Date.now()}`;
    newBoard.columns.push({
      id,
      title,
      tasks: [],
      position: newBoard.columns.length,
    });
    console.log("[Board] createColumn:", title);
    setBoard(newBoard);
    emitBoardChange(newBoard);
    toast.success("Columna creada");
    debouncedPersist(newBoard);
  };
  const updateColumn = (colId, updates) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const col = newBoard.columns.find((c) => c.id === colId);
    Object.assign(col, updates);
    console.log("[Board] updateColumn:", colId, updates);
    setBoard(newBoard);
    emitBoardChange(newBoard);
    debouncedPersist(newBoard);
  };

  // eliminar columna con bloqueo para evitar reentradas
  const deleteColumn = async (colId) => {
    if (!board) return;
    if (pendingDeleteColumns.current.has(colId)) return;
    const col = (board.columns || []).find((c) => c.id === colId);
    if (!col) return;

    pendingDeleteColumns.current.add(colId);
    try {
      const ok = await confirm(
        `¿Eliminar la columna "${col.title}"? Se eliminarán también sus ${
          (col.tasks || []).length
        } tarjeta(s).`
      );
      if (!ok) return;

      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard.columns = newBoard.columns.filter((c) => c.id !== colId);
      newBoard.columns = newBoard.columns.map((c, idx) => ({
        ...c,
        position: idx,
      }));

      setBoard(newBoard);
      emitBoardChange(newBoard);
      debouncedPersist(newBoard);
      toast.success("Columna eliminada");
    } catch (err) {
      console.error("[Board] deleteColumn error:", err);
      toast.error("Error eliminando columna");
    } finally {
      pendingDeleteColumns.current.delete(colId);
    }
  };

  // cards: crear
  const createCard = (colId, card) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const col = newBoard.columns.find((c) => c.id === colId);
    col.tasks.unshift(card);
    console.log("[Board] createCard in", colId, card?.id || card?.title);
    setBoard(newBoard);
    emitBoardChange(newBoard);
    debouncedPersist(newBoard);
  };

  // eliminar tarjeta con bloqueo para evitar reentradas
  const deleteCard = async (columnId, taskId) => {
    if (!board) return;
    const key = `${columnId}::${taskId}`;
    if (pendingDeleteCards.current.has(key)) return;

    const col = (board.columns || []).find((c) => c.id === columnId);
    if (!col) return;

    const task = (col.tasks || []).find((t) => (t.id || t._id) === taskId);
    if (!task) return;

    pendingDeleteCards.current.add(key);
    try {
      const ok = await confirm(`¿Eliminar la tarjeta "${task.title}"?`);
      if (!ok) return;

      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard.columns = newBoard.columns.map((c) =>
        c.id === columnId
          ? {
              ...c,
              tasks: (c.tasks || []).filter((t) => (t.id || t._id) !== taskId),
            }
          : c
      );

      setBoard(newBoard);
      emitBoardChange(newBoard);
      debouncedPersist(newBoard);
      toast.success("Tarjeta eliminada");
    } catch (err) {
      console.error("[Board] deleteCard error:", err);
      toast.error("Error eliminando tarjeta");
    } finally {
      pendingDeleteCards.current.delete(key);
    }
  };

  // export
  const openExportModal = () => setShowEmailModal(true);

  const handleExportSubmit = async ({ email, notifyCopy, notifyEmail }) => {
    try {
      setExportLoading(true);
      const payload = {
        email,
        board,
        notifyCopy: !!notifyCopy,
        notifyEmail: notifyCopy ? notifyEmail || null : null,
      };
      console.log("[Board] trigger export payload:", {
        email,
        notifyCopy,
        notifyEmail,
      });
      await sendExport(payload);
      console.log("[Board] export request succeeded");
      toast.success("Exportación enviada correctamente", {
        duration: 4000,
        position: "top-right",
      });
      setShowEmailModal(false);
    } catch (err) {
      console.error("[Board] Export error:", err);
      toast.error("Error al solicitar exportación: " + (err.message || err), {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setExportLoading(false);
    }
  };

  // refresh
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log("[Board] manual refresh");
      const b = await fetchBoard(boardId);
      setBoard(b);
      toast.success("Tablero actualizado");
    } catch (err) {
      console.error("[Board] refresh error:", err);
      toast.error("No se pudo actualizar");
    } finally {
      setRefreshing(false);
    }
  };

  if (error)
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  if (!board)
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center p-8 text-gray-600">Cargando tablero...</div>
      </div>
    );

  // Grid container style: cada columna toma al menos 260px y divide el espacio
  const columnsContainerStyle = {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "minmax(260px, 1fr)",
    gap: "1rem",
    overflowX: "auto",
    paddingBottom: 18,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <BoardHeader
          boardName={board.title}
          connected={connected}
          saving={saving}
        />

        {/* Toolbar */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingColumn({ mode: "create" })}
              className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
              aria-label="Nueva columna"
              title="Crear columna"
            >
              <FiPlus className="w-4 h-4" />
              <span className="text-sm">Nueva columna</span>
            </button>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
              aria-label="Refrescar"
              disabled={refreshing}
            >
              <FiRefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="text-sm">
                {refreshing ? "Actualizando..." : "Refrescar"}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              {saving ? (
                <span className="inline-flex items-center gap-1 text-gray-700">
                  <FiSlash className="w-4 h-4" />
                  Guardando...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-gray-700">
                  <FiCheckCircle className="w-4 h-4" />
                  Guardado
                </span>
              )}
            </div>

            <ExportButton
              onExport={openExportModal}
              className="hidden md:inline-flex"
            />

            <button
              onClick={openExportModal}
              className="md:hidden inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-md"
              aria-label="Exportar backlog"
              title="Exportar backlog"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mb-4">
        <div className="text-sm text-gray-600">
          {board.columns.length} columnas •{" "}
          {board.columns.reduce((s, c) => s + (c.tasks?.length || 0), 0)}{" "}
          tarjetas
        </div>
      </div>

      {/* Columns */}
      {board.columns.length === 0 ? (
        <div className="p-10 border border-dashed rounded text-center text-gray-600 bg-white">
          <div className="mb-4 text-lg font-medium">
            Este tablero no tiene columnas aún
          </div>
          <div className="mb-4">
            Comenzá creando la primera columna para organizar tus tareas.
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setEditingColumn({ mode: "create" })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md"
            >
              <FiPlus className="w-4 h-4" /> Crear columna
            </button>
            <button
              onClick={() => {
                createColumn("Backlog");
                createColumn("Doing");
                createColumn("Done");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md"
            >
              Crear plantilla básica
            </button>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={columnsContainerStyle}>
            {board.columns.map((col) => (
              <div
                key={col.id}
                className="snap-start"
                style={{ minWidth: 260 }}
              >
                <Column
                  column={col}
                  onEditColumn={() => setEditingColumn({ mode: "edit", col })}
                  onCreateCard={() =>
                    setEditingCard({ mode: "create", columnId: col.id })
                  }
                  onEditCard={(task) =>
                    setEditingCard({ mode: "edit", columnId: col.id, task })
                  }
                  onDeleteColumn={deleteColumn}
                  onDeleteCard={(taskId) => deleteCard(col.id, taskId)} // <-- paso hacia Column -> Card
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Modals */}
      {editingColumn && (
        <ColumnEditor
          initial={editingColumn}
          onClose={() => setEditingColumn(null)}
          onCreate={(title) => {
            createColumn(title);
            setEditingColumn(null);
          }}
          onUpdate={(id, updates) => {
            updateColumn(id, updates);
            setEditingColumn(null);
          }}
          onDelete={(id) => {
            deleteColumn(id);
            setEditingColumn(null);
          }}
        />
      )}

      {editingCard && (
        <CardEditor
          initial={editingCard}
          onClose={() => setEditingCard(null)}
          onCreate={(colId, data) => {
            createCard(colId, data);
            setEditingCard(null);
          }}
          onUpdate={(colId, id, payload) => {
            const newBoard = JSON.parse(JSON.stringify(board));
            const col = newBoard.columns.find((c) => c.id === colId);
            const tIdx = col.tasks.findIndex((x) => (x.id || x._id) === id);
            if (tIdx !== -1) col.tasks[tIdx] = payload;
            setBoard(newBoard);
            emitBoardChange(newBoard);
            debouncedPersist(newBoard);
            setEditingCard(null);
          }}
          onDelete={(colId, id) => {
            deleteCard(colId, id);
            setEditingCard(null);
          }}
        />
      )}
      {ConfirmModalElement}
      {showEmailModal && (
        <EmailModal
          initialEmail={initialUserEmail}
          loading={exportLoading}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleExportSubmit}
        />
      )}
    </div>
  );
}
