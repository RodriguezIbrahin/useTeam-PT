import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket({ boardId, onBoard, url }) {
  // url opcional: import.meta.env.VITE_WS_URL || "ws://localhost:3000"
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!boardId) return;
    const socket = io(
      url || import.meta.env.VITE_WS_URL || "ws://localhost:3000",
      {
        transports: ["websocket"],
        reconnectionAttempts: 5,
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinBoard", { boardId });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("board", (board) => {
      // evento inicial con estado actual
      onBoard && onBoard(board);
    });

    socket.on("boardUpdated", (board) => {
      // cambios de otros usuarios
      onBoard && onBoard(board);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [boardId, onBoard, url]);

  // enviar cambio (los componentes usarán esto)
  const emitBoardChange = (board) => {
    if (!socketRef.current || !socketRef.current.connected) return;
    socketRef.current.emit("boardChange", { boardId, board });
  };

  return { emitBoardChange, connected, socket: socketRef.current };
}
