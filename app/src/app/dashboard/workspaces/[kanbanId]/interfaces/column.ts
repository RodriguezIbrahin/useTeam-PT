import { Task } from "@/app/dashboard/workspaces/[kanbanId]/interfaces/task";

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
