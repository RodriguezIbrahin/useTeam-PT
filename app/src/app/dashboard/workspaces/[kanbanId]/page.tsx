"use client";
import { AddTaskDialog } from "@/app/dashboard/workspaces/[kanbanId]/components/add-task-dialog";
import { Draggable } from "@/app/dashboard/workspaces/[kanbanId]/components/draggable";
import { Droppable } from "@/app/dashboard/workspaces/[kanbanId]/components/droppable";
import { TaskCard } from "@/app/dashboard/workspaces/[kanbanId]/components/task-card";
import { Column } from "@/app/dashboard/workspaces/[kanbanId]/interfaces/column";
import {
  handleColumnDrag,
  handleTaskDrag,
} from "@/app/dashboard/workspaces/[kanbanId]/lib/lib";
import { initialData } from "@/app/dashboard/workspaces/[kanbanId]/mock-up/data";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
} from "@dnd-kit/core";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

const KanbanPage = () => {
  const [columns, setColumns] = useState<Column[]>(initialData as Column[]);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 200, // 0.2s presionado
      tolerance: 8, // mover al menos 8px
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200, // 0.2s presionado
      tolerance: 8, // mover al menos 8px
    },
  });
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.type === "column") {
      handleColumnDrag(
        active.id as string,
        over.id as string,
        columns,
        setColumns
      );
      return;
    }

    if (active.data.current?.type === "task") {
      handleTaskDrag(
        active.id as string,
        active.data.current?.arrPosition as number,
        over.id as string,
        columns,
        setColumns
      );
    }
  };

  return (
    <>
      <Button className="grid place-self-end">Agregar columna</Button>
      <div className="h-full flex gap-6 overflow-x-auto pb-6">
        <DndContext
          sensors={[mouseSensor, touchSensor]}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          {columns.map((column, index) => (
            <Droppable
              type="column"
              className="h-full flex gap-6 p-6"
              columnId={column.id}
              key={column.id}
            >
              <Draggable
                draggableId={column.id}
                data={{ type: "column", arrPosition: index }}
                className="p-2 bg-background"
              >
                <div className="flex-shrink-0 w-80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-base">
                        {column.title}
                      </h2>
                      <Badge variant="secondary" className="rounded-full">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <AddTaskDialog />

                  <Droppable type="task" key={column.id} columnId={column.id}>
                    <div className="space-y-3">
                      {column.tasks.map((task, idx) => (
                        <Draggable
                          draggableId={task.id}
                          data={{
                            type: "task",
                            columnId: column.id,
                            arrPosition: idx,
                          }}
                          key={task.id}
                        >
                          <TaskCard task={task} />
                        </Draggable>
                      ))}
                    </div>
                  </Droppable>
                </div>
              </Draggable>
            </Droppable>
          ))}
        </DndContext>
      </div>
    </>
  );
};

export default KanbanPage;
