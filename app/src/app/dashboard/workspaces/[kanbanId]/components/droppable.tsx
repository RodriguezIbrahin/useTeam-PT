"use client";

import { cn } from "@/core/lib/utils";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { HTMLAttributes, PropsWithChildren } from "react";

interface DroppableProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  columnId: string;
  type: "column" | "task" | "board";
}

export const Droppable = ({
  columnId,
  type,
  children,
  className,
  ...rest
}: DroppableProps) => {
  const { active } = useDndContext();

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type },
  });

  return (
    <div ref={setNodeRef} className={cn("h-full p-4", className)} {...rest}>
      {children}
    </div>
  );
};
