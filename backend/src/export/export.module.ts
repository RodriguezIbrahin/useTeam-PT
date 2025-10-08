import { Module } from "@nestjs/common";
import { ExportController } from "./export.controller";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";
import { BoardModule } from "../board/board.module";

@Module({
  imports: [BoardModule],
  controllers: [ExportController, MailController],
  providers: [MailService],
  exports: [MailService],
})
export class ExportModule {}
