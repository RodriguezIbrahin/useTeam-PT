import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ColumnsService } from '@app/columns/services/columns.service';
import { CreateColumnDto } from '@app/columns/dto/create-column.dto';
import { UpdateColumnDto } from '@app/columns/dto/update-column.dto';

@WebSocketGateway()
export class ColumnsGateway {
  constructor(private readonly columnsService: ColumnsService) {}

  @SubscribeMessage('createColumn')
  create(@MessageBody() createColumnDto: CreateColumnDto) {
    return this.columnsService.create(createColumnDto);
  }

  @SubscribeMessage('findAllColumns')
  findAll() {
    return this.columnsService.findAll();
  }

  @SubscribeMessage('findOneColumn')
  findOne(@MessageBody() id: number) {
    return this.columnsService.findOne(id);
  }

  @SubscribeMessage('updateColumn')
  update(@MessageBody() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.update(updateColumnDto.id, updateColumnDto);
  }

  @SubscribeMessage('removeColumn')
  remove(@MessageBody() id: number) {
    return this.columnsService.remove(id);
  }
}
