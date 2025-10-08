import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Board, BoardDocument } from "../schemas/board.schema";

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);

  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>
  ) {}

  async createDefaultBoard(title = "Default Board") {
    const defaultBoard = new this.boardModel({
      // dejamos que el cliente o mongoose genere el _id si no se provee
      title,
      columns: [
        { id: "col-1", title: "Backlog", tasks: [], position: 0 },
        { id: "col-2", title: "Doing", tasks: [], position: 1 },
        { id: "col-3", title: "Done", tasks: [], position: 2 },
      ],
    });
    return defaultBoard.save();
  }

  async createDefaultBoardWithId(boardId: string, title = "Default Board") {
    const created = new this.boardModel({
      _id: boardId,
      title,
      columns: [
        { id: "col-1", title: "Backlog", tasks: [], position: 0 },
        { id: "col-2", title: "Doing", tasks: [], position: 1 },
        { id: "col-3", title: "Done", tasks: [], position: 2 },
      ],
    });
    return created.save();
  }

  async getBoard(boardId: string) {
    try {
      // findOne evita casteos forzosos a ObjectId y previene CastError
      return await this.boardModel.findOne({ _id: boardId }).lean();
    } catch (err) {
      this.logger.error("getBoard error", err);
      return null;
    }
  }

  async getBoardOrCreate(boardId: string) {
    if (!boardId) throw new Error("boardId required");
    const b = await this.getBoard(boardId);
    if (b) return b;
    // crear con _id explícito (ahora schema acepta string)
    try {
      await this.createDefaultBoardWithId(boardId, `Board ${boardId}`);
      return this.getBoard(boardId);
    } catch (err) {
      this.logger.error("Error creating board", err);
      throw err;
    }
  }

  async saveBoard(boardId: string, data: any) {
    // buscar por findOne para evitar CastError
    const found = await this.boardModel.findOne({ _id: boardId });
    if (found) {
      found.columns = data.columns ?? found.columns;
      if (data.title) found.title = data.title;
      return found.save();
    } else {
      const created = new this.boardModel({
        _id: boardId,
        title: data.title || "Board",
        columns: data.columns || [],
      });
      return created.save();
    }
  }

  // ---- Métodos granulares ----
  async addCard(boardId: string, columnId: string, card: any) {
    const board = await this.boardModel.findOne({ _id: boardId });
    if (!board) throw new Error("Board not found");
    const col = board.columns.find((c) => c.id === columnId);
    if (!col) throw new Error("Column not found");
    col.tasks.push(card);
    return board.save();
  }

  async updateCard(boardId: string, cardId: string, updates: any) {
    const board = await this.boardModel.findOne({ _id: boardId });
    if (!board) throw new Error("Board not found");
    for (const col of board.columns) {
      const t = col.tasks.find((x) => x.id === cardId);
      if (t) {
        Object.assign(t, updates);
        return board.save();
      }
    }
    throw new Error("Card not found");
  }

  async deleteCard(boardId: string, cardId: string) {
    const board = await this.boardModel.findOne({ _id: boardId });
    if (!board) throw new Error("Board not found");
    for (const col of board.columns) {
      const idx = col.tasks.findIndex((x) => x.id === cardId);
      if (idx !== -1) {
        col.tasks.splice(idx, 1);
        return board.save();
      }
    }
    throw new Error("Card not found");
  }

  async moveCard(
    boardId: string,
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex?: number
  ) {
    const board = await this.boardModel.findOne({ _id: boardId });
    if (!board) throw new Error("Board not found");

    const from = board.columns.find((c) => c.id === fromColumnId);
    const to = board.columns.find((c) => c.id === toColumnId);
    if (!from || !to) throw new Error("Column not found");

    const cardIdx = from.tasks.findIndex((t) => t.id === cardId);
    if (cardIdx === -1) throw new Error("Card not found in source column");

    const [card] = from.tasks.splice(cardIdx, 1);
    const idx =
      typeof newIndex === "number"
        ? Math.max(0, Math.min(newIndex, to.tasks.length))
        : to.tasks.length;
    to.tasks.splice(idx, 0, card);

    return board.save();
  }

  async getBoardWithTasks(boardId: string) {
    return this.getBoard(boardId);
  }

  async listBoards() {
    // devolver solo campos necesarios para la lista
    return this.boardModel.find({}, { title: 1 }).lean();
  }
}
