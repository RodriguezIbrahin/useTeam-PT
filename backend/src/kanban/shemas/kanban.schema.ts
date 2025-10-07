import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type KanbanDocument = HydratedDocument<Kanban>;

@Schema({ timestamps: true })
export class Kanban {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Columns' }] })
  columns: Types.ObjectId[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members?: Types.ObjectId[];
}

export const KanbanSchema = SchemaFactory.createForClass(Kanban);
