export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
  dueDate: string;
  comments: number;
}
