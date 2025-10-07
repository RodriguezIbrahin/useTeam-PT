"use client";
import { Button } from "@/core/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/core/components/ui/label";
import {
  KanbanCreateType,
  kanbanCreateSchema,
} from "@/app/dashboard/workspaces/components/kanban-list/kanban-create-dialog/schemas/kanban-create-schema";
import { Input } from "@/core/components/ui/input";
import { getValidationError } from "@/core/lib/get-validation-error";
import { validationErrorEmitter } from "@/core/lib/validation-error-observer";
import { usePostKanban } from "@/app/dashboard/workspaces/components/kanban-list/kanban-create-dialog/hooks/mutations/usePostKanban";
import { ValidationException } from "@/core/exceptions/validation-exception";
export const KanbanCreateContent = () => {
  const { control, handleSubmit } = useForm<KanbanCreateType>({
    resolver: zodResolver(kanbanCreateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { postKanban, isPending } = usePostKanban();
  const onSubmit = handleSubmit(
    (data) => {
      postKanban(data);
    },
    (errors) => {
      const error = getValidationError(errors);
      console.log(error);
      validationErrorEmitter.emit(new ValidationException(error));
    }
  );
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Crear nuevo kanban</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label>Nombre:</Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input {...field} placeholder="ej. Organiza api kanban" />
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label>Descripción:</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="ej. Breve descripción del kanban"
                />
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isPending} variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button disabled={isPending} type="submit">
            Crear
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
