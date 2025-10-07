import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomsService } from '@app/rooms/services/rooms.service';

@WebSocketGateway()
export class RoomsGateway {
  constructor(private readonly roomsService: RoomsService) {}
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room-${roomId}`);
    return { message: `Joined room ${roomId}` };
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`room-${roomId}`);
    return { message: `Left room ${roomId}` };
  }
}
