import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import "dotenv/config";

@Injectable()
export class MailService {
  private transporter;
  private logger = new Logger(MailService.name);
  private readonly from = `"useTeam" <no-reply@useteam.local>`;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: process.env.MAIL_USER
        ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
        : undefined,
    });

    this.transporter
      .verify()
      .then(() => {
        this.logger.log("Mail transporter ready");
      })
      .catch((err) => {
        this.logger.warn(
          "Mail transporter verify failed: " + (err?.message || err)
        );
      });
  }

  /**
   * Envía un email simple (sin adjuntos). Útil para confirmaciones.
   */
  async sendSimpleEmail(
    to: string,
    subject: string,
    text?: string,
    html?: string
  ) {
    try {
      const info = await this.transporter.sendMail({
        from: `"useTeam" <no-reply@useteam.local>`,
        to,
        subject,
        text,
        html,
      });
      this.logger.log(
        `Simple email sent to ${to}. messageId=${info.messageId}`
      );
      return info;
    } catch (err) {
      this.logger.error("Error sending simple email", err);
      throw err;
    }
  }

  /**
   * Envía un email con CSV adjunto .
   * Cambios: uso Buffer + BOM para mejor compatibilidad con Excel/Outlook.
   */
  async sendCsvEmail(
    to: string,
    csvContent: string,
    filename = "backlog.csv",
    bodyText?: string
  ) {
    try {
      // agregar BOM si no existe (para Excel)
      const bom = "\uFEFF";
      const contentWithBom = csvContent.startsWith(bom)
        ? csvContent
        : bom + csvContent;

      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject: "Backlog export - Kanban",
        text: bodyText || "Adjunto el CSV con el backlog.",
        attachments: [
          {
            filename,
            content: Buffer.from(contentWithBom, "utf8"),
            contentType: "text/csv; charset=utf-8",
          },
        ],
      });

      this.logger.log(`CSV email sent to ${to}. messageId=${info.messageId}`);
      return info;
    } catch (err) {
      this.logger.error("Error sending CSV email", err);
      throw err;
    }
  }

  // helper: escape HTML minimal para la nota
  private escapeHtml(input: string) {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
