import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

type TasksDocument = HydratedDocument<Tasks>;

@Schema({
  timestamps: true,
})
export class Tasks {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Tasks', default: [] })
  tasks: Types.ObjectId[];
}

export const TaksSchema = SchemaFactory.createForClass(Tasks);
