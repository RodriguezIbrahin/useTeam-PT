// backend/src/export/mail.controller.ts
import { Controller, Post, Body } from "@nestjs/common";
import { MailService } from "./mail.service";
import { SendEmailDto } from "./dto/send-email.dto";

@Controller("export")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post("send-email")
  async sendEmail(@Body() dto: SendEmailDto) {
    const { email, csv, fileName } = dto;
    await this.mailService.sendCsvEmail(email, csv, fileName || "backlog.csv");
    return { status: "sent" };
  }
}
