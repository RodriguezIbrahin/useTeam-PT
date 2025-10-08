import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import axios from "axios";
import { BoardService } from "../board/services/board.service";
import { MailService } from "./mail.service";

@Controller("export")
export class ExportController {
  private readonly logger = new Logger(ExportController.name);

  constructor(
    private boardService: BoardService,
    private mailService: MailService
  ) {}

  @Post("backlog")
  async exportBacklog(
    @Body()
    dto: {
      email: string;
      boardId?: string;
      board?: any;
      note?: string;
      notifyCopy?: boolean;
      notifyEmail?: string;
    }
  ) {
    const { email, boardId, board, note } = dto || {};
    let { notifyCopy, notifyEmail } = dto || {};

    if (!email) throw new BadRequestException("email required");

    // fallback: si piden copia pero no pasa notifyEmail → usar el mismo email
    if (notifyCopy && !notifyEmail) notifyEmail = email;

    // resolver board
    let usedBoard = board;
    if (!usedBoard && boardId)
      usedBoard = await this.boardService.getBoardWithTasks(boardId);
    if (!usedBoard)
      throw new HttpException("Board not found", HttpStatus.NOT_FOUND);

    const url = process.env.N8N_WEBHOOK_URL;
    if (!url)
      throw new HttpException(
        "N8N_WEBHOOK_URL not set",
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    // 1) Trigger n8n
    try {
      await axios.post(
        url,
        {
          board: usedBoard,
          email,
          note,
          notifyCopy: !!notifyCopy,
          notifyEmail,
        },
        { timeout: 10000 }
      );
      this.logger.log("n8n webhook triggered");
    } catch (err) {
      this.logger.error("Failed to trigger n8n", err?.message || err);
      throw new HttpException(
        "Failed to trigger n8n",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // 2) Construir CSV
    const rows: string[][] = [];
    (usedBoard.columns || []).forEach((col: any) => {
      (col.tasks || []).forEach((task: any) => {
        rows.push([
          task.id || task._id || "",
          (task.title || "").toString().replace(/"/g, '""'),
          (task.description || "").toString().replace(/"/g, '""'),
          col.title || "",
          task.createdAt ? new Date(task.createdAt).toISOString() : "",
        ]);
      });
    });
    const header = ["id", "title", "description", "column", "createdAt"];
    const csvContent =
      "\uFEFF" +
      [
        header.join(","),
        ...rows.map((r) => r.map((f) => `"${f}"`).join(",")),
      ].join("\n");
    const filename = `backlog-${usedBoard._id || boardId || "export"}.csv`;

    // 3) Texto confirmación
    const confirmText = `Enviaste exitosamente el tablero "${
      usedBoard.title || ""
    }" al destinatario con correo: ${email}.\n\nNota: ${
      note || ""
    }\n\nAdjunto tu copia del backlog exportado.`;

    const sendTasks: Promise<any>[] = [];

    try {
      // Enviar un solo correo al requester con confirmación + CSV adjunto
      sendTasks.push(
        this.mailService.sendCsvEmail(email, csvContent, filename, confirmText)
      );
    } catch (err) {
      this.logger.error("Error building send tasks", err?.message || err);
    }

    const results = await Promise.allSettled(sendTasks);
    const summary = results.map((r, idx) =>
      r.status === "fulfilled"
        ? { idx, ok: true }
        : { idx, ok: false, reason: r.reason?.message || String(r.reason) }
    );

    this.logger.log("Mail send results: " + JSON.stringify(summary));

    return {
      status: "sent-to-n8n",
      notifyCopy: !!notifyCopy,
      notifyEmail: notifyEmail || null,
      mailSummary: summary,
    };
  }

  private escapeHtml(input: string) {
    if (!input) return "";
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
