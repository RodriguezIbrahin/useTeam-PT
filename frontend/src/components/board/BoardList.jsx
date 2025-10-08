import React, { useEffect, useState } from "react";
import { fetchBoards } from "../../services/api";
import CreateBoardModal from "./CreateBoardModal";
import toast from "react-hot-toast";

export default function BoardsList({ onEnterBoard }) {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchBoards();
      setBoards(data || []);
    } catch (err) {
      console.error("fetchBoards error", err);
      toast.error("Error cargando tableros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createBoardApi = async ({ title, ownerEmail }) => {
    const id = `board-${Date.now()}`;
    const payload = {
      title,
      columns: [
        { id: "col-1", title: "Backlog", tasks: [], position: 0 },
        { id: "col-2", title: "Doing", tasks: [], position: 1 },
        { id: "col-3", title: "Done", tasks: [], position: 2 },
      ],
    };
    if (ownerEmail) payload["ownerEmail"] = ownerEmail;

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/board/${id}/save`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || res.statusText);
      }

      const created = await res.json();
      toast.success("✅ Tablero creado correctamente");
      await load();
      onEnterBoard(created._id || id);
    } catch (err) {
      console.error("createBoardApi error", err);
      toast.error("Error creando tablero");
    }
  };

  const modernButton =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out text-sm";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Tus tableros</h2>
        <div className="flex gap-2">
          <button
            onClick={load}
            className={`${modernButton} bg-gray-100 text-gray-800 hover:bg-gray-200`}
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className={`${modernButton} bg-black text-white hover:opacity-90`}
          >
            ➕ Nuevo tablero
          </button>
        </div>
      </div>

      {/* Modal */}
      <CreateBoardModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createBoardApi}
      />

      {/* Lista */}
      {loading ? (
        <div className="text-center py-6 text-gray-500">
          Cargando tableros...
        </div>
      ) : boards.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No hay tableros aún. Crea uno nuevo para comenzar.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((b) => (
            <div
              key={b._id || b.id}
              className="p-5 border border-gray-200 rounded-lg hover:border-black transition cursor-pointer flex flex-col justify-between bg-white"
            >
              <div className="font-semibold text-lg text-gray-800">
                {b.title || b._id || b.id}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onEnterBoard(b._id || b.id)}
                  className={`${modernButton} bg-black text-white hover:opacity-90`}
                >
                  ▶ Entrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
