"use client";

import { useGetKanbans } from "@/app/dashboard/workspaces/components/hooks/queries/useGetKanbans";
import { KanbanCreateDialog } from "@/app/dashboard/workspaces/components/kanban-list/kanban-create-dialog";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { LoaderPulse } from "@/core/components/ui/loader";

export const KanbanList = () => {
  const { kanbans, isPending, refetch } = useGetKanbans();
  if (isPending) {
    <LoaderPulse />;
  }

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <Button onClick={() => refetch()}>Refrescar</Button>
        <KanbanCreateDialog />
      </div>
      {!kanbans || kanbans.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center">
          <p className="mb-4 text-lg">No hay kanbans disponibles.</p>
          <Button onClick={() => refetch()}>Refrescar</Button>
        </div>
      ) : (
        kanbans.map((kanban) => (
          <Card key={kanban.id}>
            <CardHeader>
              <CardTitle>{kanban.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{kanban.description}</p>
              <Button>Acceder</Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
