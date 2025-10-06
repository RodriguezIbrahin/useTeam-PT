import { Task } from "@/app/dashboard/workspaces/[kanbanId]/interfaces/task";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import { cn } from "@/core/lib/utils";
import { Calendar, MessageSquare } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const PRIORITY_COLOR: Record<string, string> = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-amber-500 text-white",
    low: "bg-blue-500 text-white",
  };

  const getPriorityColor = (priority: string) =>
    PRIORITY_COLOR[priority] || "bg-muted text-muted-foreground";
  return (
    <Card
      key={task.id}
      className="cursor-pointer transition-all hover:shadow-md"
    >
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm leading-tight text-balance">
            {task.title}
          </h3>
          <Badge
            className={cn(
              "text-xs px-2 py-0.5",
              getPriorityColor(task.priority)
            )}
          >
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-4 text-pretty">
          {task.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {task.dueDate}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {task.comments}
            </div>
          </div>
          <Avatar className="h-7 w-7">
            <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {task.assignee.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
};
