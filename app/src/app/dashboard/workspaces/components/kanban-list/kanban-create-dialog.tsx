import { KanbanCreateContent } from "@/app/dashboard/workspaces/components/kanban-list/kanban-create-dialog/kanban-create-content";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/core/components/ui/dialog";

export const KanbanCreateDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Agregar kanban</Button>
      </DialogTrigger>
      <KanbanCreateContent />
    </Dialog>
  );
};
