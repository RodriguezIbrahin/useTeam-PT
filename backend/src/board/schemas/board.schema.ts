import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BoardDocument = Board & Document;

@Schema({ _id: false })
export class Task {
  @Prop({ required: true }) id: string;
  @Prop() title: string;
  @Prop() description?: string;
  @Prop() createdAt?: Date;
  @Prop() updatedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

@Schema({ _id: false })
export class Column {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) title: string;
  @Prop({ type: [TaskSchema], default: [] }) tasks: Task[];
  @Prop({ default: 0 }) position: number;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);

@Schema({ timestamps: true })
export class Board {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [ColumnSchema], default: [] })
  columns: Column[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
