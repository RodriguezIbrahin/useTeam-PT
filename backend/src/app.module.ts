import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardModule } from "./board/board.module";
import { ExportModule } from "./export/export.module";
import { KanbanGateway } from "./gateway/kanban.gateway";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || "mongodb://localhost:27017/kanban-board"
    ),
    BoardModule,
    ExportModule,
    HealthModule,
  ],
  providers: [KanbanGateway],
})
export class AppModule {}
