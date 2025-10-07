import { Module } from '@nestjs/common';
import { ColumnsService } from '@app/columns/services/columns.service';
import { ColumnsGateway } from '@app/columns/gateway/columns.gateway';

@Module({
  providers: [ColumnsGateway, ColumnsService],
})
export class ColumnsModule {}
