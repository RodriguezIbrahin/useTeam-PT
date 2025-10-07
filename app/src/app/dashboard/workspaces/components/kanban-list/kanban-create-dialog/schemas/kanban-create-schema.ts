import { z } from "zod";

export const kanbanCreateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
});

export type KanbanCreateType = z.infer<typeof kanbanCreateSchema>;
