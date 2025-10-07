import { Module } from '@nestjs/common';
import { RoomsService } from '@app/rooms/services/rooms.service';
import { RoomsGateway } from '@app/rooms/gateway/rooms.gateway';

@Module({
  providers: [RoomsGateway, RoomsService],
})
export class RoomsModule {}
