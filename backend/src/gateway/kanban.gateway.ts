import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { BoardService } from "../board/services/board.service";

type PresenceMap = {
  [boardRoom: string]: {
    [socketId: string]: { userId?: string; name?: string };
  };
};

@WebSocketGateway({ cors: { origin: true }, path: "/socket.io" })
export class KanbanGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger("KanbanGateway");
  private presence: PresenceMap = {};

  constructor(private readonly boardService: BoardService) {}

  afterInit(server: Server) {
    this.logger.log("Gateway initialized");
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // limpiar presencia de cualquier sala
    Object.keys(this.presence).forEach((room) => {
      if (this.presence[room]?.[client.id]) {
        delete this.presence[room][client.id];
        // emitir presenceUpdate a la room
        this.server
          .to(room)
          .emit("presenceUpdate", Object.values(this.presence[room]));
      }
    });
  }

  // JOIN: espera { boardId, user?: { userId, name } }
  @SubscribeMessage("joinBoard")
  async handleJoinBoard(
    @MessageBody()
    data: { boardId: string; user?: { userId?: string; name?: string } },
    @ConnectedSocket() client: Socket
  ) {
    const { boardId, user } = data || {};
    if (!boardId) throw new WsException("boardId required");
    const room = `board:${boardId}`;

    client.join(room);
    this.logger.log(`Client ${client.id} joined ${room}`);

    // registrar presencia
    if (!this.presence[room]) this.presence[room] = {};
    this.presence[room][client.id] = {
      userId: user?.userId,
      name: user?.name || `u-${client.id}`,
    };
    // emitir presence
    this.server
      .to(room)
      .emit("presenceUpdate", Object.values(this.presence[room]));

    // enviar estado actual del board (nombre: boardState para coincidir con cliente)
    try {
      const board = await this.boardService.getBoardWithTasks(boardId);
      if (board) {
        client.emit("boardState", board);
      } else {
        // crear default si no existe
        const created = await this.boardService.createDefaultBoard(
          `Board ${boardId}`
        );

        client.emit("boardState", created);
      }
    } catch (err) {
      this.logger.error("Error fetching board", err);
      client.emit("error", { message: "Error fetching board" });
    }
  }

  @SubscribeMessage("leaveBoard")
  handleLeaveBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { boardId } = data || {};
    if (!boardId) return;
    const room = `board:${boardId}`;
    client.leave(room);
    if (this.presence[room]?.[client.id]) {
      delete this.presence[room][client.id];
      this.server
        .to(room)
        .emit("presenceUpdate", Object.values(this.presence[room]));
    }
    this.logger.log(`Client ${client.id} left ${room}`);
  }

  // Ejemplo granular: crear tarjeta
  @SubscribeMessage("createCard")
  async handleCreateCard(
    @MessageBody() data: { boardId: string; columnId: string; card: any },
    @ConnectedSocket() client: Socket
  ) {
    const { boardId, columnId, card } = data || {};
    if (!boardId || !columnId || !card) {
      client.emit("actionError", {
        action: "createCard",
        message: "boardId, columnId and card required",
      });
      return;
    }
    const room = `board:${boardId}`;
    try {
      // Manipular board y guardar.
      const board = await this.boardService.getBoard(boardId);
      if (!board) throw new Error("Board not found");

      // crear id si no trae
      const newCard = { ...card, id: card.id || `card-${Date.now()}` };

      // insertar en columna
      const col = board.columns.find((c) => c.id === columnId);
      if (!col) throw new Error("Column not found");
      col.tasks.push(newCard);

      const saved = await this.boardService.saveBoard(boardId, board);
      // emitir a room (incluye al emisor)
      this.server.to(room).emit("cardCreated", { card: newCard, columnId });
      client.emit("ack", { action: "createCard", ok: true, card: newCard });
    } catch (err) {
      this.logger.error("createCard error", err);
      client.emit("ack", {
        action: "createCard",
        ok: false,
        error: err.message,
      });
    }
  }

  @SubscribeMessage("moveCard")
  async handleMoveCard(
    @MessageBody()
    data: {
      boardId: string;
      cardId: string;
      fromColumnId: string;
      toColumnId: string;
      newIndex: number;
    },
    @ConnectedSocket() client: Socket
  ) {
    const { boardId, cardId, fromColumnId, toColumnId, newIndex } = data || {};
    const room = `board:${boardId}`;
    try {
      const board = await this.boardService.getBoard(boardId);
      if (!board) throw new Error("Board not found");

      // remover de origen
      const fromCol = board.columns.find((c) => c.id === fromColumnId);
      const toCol = board.columns.find((c) => c.id === toColumnId);
      if (!fromCol || !toCol) throw new Error("Column not found");

      const cardIndex = fromCol.tasks.findIndex((t) => t.id === cardId);
      if (cardIndex === -1) throw new Error("Card not found in fromColumn");

      const [card] = fromCol.tasks.splice(cardIndex, 1);
      // colocar en destino en newIndex
      const idx =
        typeof newIndex === "number"
          ? Math.max(0, Math.min(newIndex, toCol.tasks.length))
          : toCol.tasks.length;
      toCol.tasks.splice(idx, 0, card);

      const saved = await this.boardService.saveBoard(boardId, board);

      // emitir evento a todos
      this.server
        .to(room)
        .emit("cardMoved", { card, fromColumnId, toColumnId, newIndex: idx });
      client.emit("ack", { action: "moveCard", ok: true });
    } catch (err) {
      this.logger.error("moveCard error", err);
      client.emit("ack", { action: "moveCard", ok: false, error: err.message });
    }
  }

  // Handler genérico para seguir teniendo boardChange con persistencia
  @SubscribeMessage("boardChange")
  async handleBoardChange(
    @MessageBody() data: { boardId: string; board: any },
    @ConnectedSocket() client: Socket
  ) {
    const { boardId, board } = data || {};
    if (!boardId || !board) {
      client.emit("saved", { ok: false, error: "boardId and board required" });
      return;
    }
    const room = `board:${boardId}`;

    try {
      // persistir primero
      await this.boardService.saveBoard(boardId, board);
      // emitir el estado actualizado a la room
      this.server.to(room).emit("boardUpdated", board);
      client.emit("saved", { ok: true, timestamp: new Date().toISOString() });
    } catch (err) {
      this.logger.error("Error saving board", err);
      client.emit("saved", { ok: false, error: err.message });
    }
  }
}
