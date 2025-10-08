import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from "@nestjs/common";
import { BoardService } from "../services/board.service";
import { SaveBoardDto } from "../dto/save-board.dto";

@Controller("board")
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get() // lista todos los boards (id + title)
  async listBoards() {
    return this.boardService.listBoards();
  }

  @Get(":id")
  async getBoard(@Param("id") id: string) {
    return this.boardService.getBoardOrCreate(id);
  }

  @Post(":id/save")
  async saveBoard(@Param("id") id: string, @Body() body: SaveBoardDto) {
    // si la validación falla, el ValidationPipe lanzará automáticamente 400
    if (!body) throw new BadRequestException("body required");
    const saved = await this.boardService.saveBoard(id, body);
    return saved;
  }

  @Post(":id/move")
  async move(@Param("id") id: string, @Body() body: any) {
    if (!body?.board) throw new BadRequestException("body.board required");
    const saved = await this.boardService.saveBoard(id, body.board);
    return { ok: true, saved };
  }
}
