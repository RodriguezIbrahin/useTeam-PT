import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

type ColumnsDocument = HydratedDocument<Columns>;

@Schema({
  timestamps: true,
})
export class Columns {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Tasks', default: [] })
  tasks: Types.ObjectId[];
}

export const ColumnsSchema = SchemaFactory.createForClass(Columns);
