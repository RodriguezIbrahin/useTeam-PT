"use client";
import { cn } from "@/core/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { HTMLAttributes, PropsWithChildren } from "react";

interface DraggableProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  draggableId: string;
  data: {
    type: "column" | "task" | "board";
    columnId?: string;
    arrPosition?: number;
  };
}

export const Draggable = ({
  children,
  draggableId,
  data,
  className,
  ...rest
}: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: draggableId,
      data,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(isDragging ? "opacity-50" : "", className)}
      {...rest}
    >
      {children}
    </div>
  );
};
