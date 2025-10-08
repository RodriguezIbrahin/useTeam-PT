import React, { useEffect, useState } from "react";
import BoardsList from "./components/board/BoardList";
import Board from "./components/board/Board";
import RegisterModal from "./components/modals/RegisterModal";
import { waitForBackendHealth } from "./services/waitForBackend";

function App() {
  const [boardId, setBoardId] = useState(null);
  const [backendReady, setBackendReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedName = localStorage.getItem("userName");
    if (savedEmail) setUser({ email: savedEmail, name: savedName || "" });
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setChecking(true);
      const ok = await waitForBackendHealth({
        timeoutMs: 60000,
        onAttempt: (a) => mounted && setAttempts(a),
      });
      if (mounted) {
        setBackendReady(ok);
        setChecking(false);
        if (!localStorage.getItem("userEmail")) setShowRegister(true);
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleRegisterSave = ({ email, name }) => {
    localStorage.setItem("userEmail", email);
    if (name) localStorage.setItem("userName", name);
    setUser({ email, name: name || "" });
    setShowRegister(false);
  };

  const handleChangeEmail = () => setShowRegister(true);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 animate-pulse">
            Iniciando servidor...
          </p>
          <p className="text-sm text-gray-500">Intento: {attempts}</p>
          <p className="text-sm text-gray-400 mt-2">
            Esperando respuesta del backend
          </p>
        </div>
      </div>
    );
  }

  if (!backendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            Backend no disponible
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Revisá los logs o reiniciá el servidor.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded text-sm hover:opacity-90 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Register modal */}
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onSave={handleRegisterSave}
      />

      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">useTeam</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.email}</span>
                <button
                  onClick={handleChangeEmail}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Cambiar
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowRegister(true)}
                className="px-3 py-1 bg-black text-white rounded text-sm hover:opacity-90 transition"
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16">
        {!user ? (
          <div className="text-center text-gray-500 mt-10">
            Por favor regístrate para continuar.
          </div>
        ) : !boardId ? (
          <BoardsList onEnterBoard={(id) => setBoardId(id)} />
        ) : (
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <button
                className="px-2 py-1 text-sm text-gray-600 hover:text-black transition"
                onClick={() => setBoardId(null)}
              >
                ← Mis tableros
              </button>
              <span className="text-sm text-gray-500">
                Notificación a: {user.email}
              </span>
            </div>
            <Board boardId={boardId} user={user} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
