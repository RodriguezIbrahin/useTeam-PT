import { Column } from "@/app/dashboard/workspaces/[kanbanId]/interfaces/column";

const reorderArray = <T>(arr: T[], from: number, to: number): T[] => {
  const newArr = [...arr];
  const [moved] = newArr.splice(from, 1);
  newArr.splice(to, 0, moved);
  return newArr;
};

// --- COLUMNAS ---
export const handleColumnDrag = (
  activeId: string,
  overId: string,
  columns: Column[],
  setColumns: (cols: Column[]) => void
) => {
  const oldIndex = columns.findIndex((c) => c.id === activeId);
  const newIndex = columns.findIndex((c) => c.id === overId);
  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

  setColumns(reorderArray(columns, oldIndex, newIndex));
};

// --- TAREAS ---
export const handleTaskDrag = (
  activeId: string,
  arrayPos: number,
  overId: string,
  columns: Column[],
  setColumns: (cols: Column[]) => void
) => {
  let fromColIndex = -1;
  let toColIndex = -1;

  columns.forEach((col, idx) => {
    if (col.tasks.some((t) => t.id === activeId)) fromColIndex = idx;
    if (col.id === overId || col.tasks.some((t) => t.id === overId))
      toColIndex = idx;
  });

  if (fromColIndex === -1 || toColIndex === -1) return;

  const fromCol = columns[fromColIndex];
  const toCol = columns[toColIndex];

  const movedTask = fromCol.tasks[arrayPos];
  let toTaskIndex: number;
  if (fromColIndex === toColIndex) {
    const overIndex = toCol.tasks.findIndex((t) => t.id === overId);
    toTaskIndex = overIndex !== -1 ? overIndex : toCol.tasks.length;
  } else {
    const overIndex = toCol.tasks.findIndex((t) => t.id === overId);
    if (overIndex !== -1) {
      toTaskIndex = overIndex;
    } else {
      toTaskIndex = Math.min(arrayPos, toCol.tasks.length);
    }
  }

  if (fromColIndex === toColIndex) {
    const newTasks = reorderArray(fromCol.tasks, arrayPos, toTaskIndex);
    const newColumns = [...columns];
    newColumns[fromColIndex] = { ...fromCol, tasks: newTasks };
    setColumns(newColumns);
  } else {
    const newFromTasks = [...fromCol.tasks];
    newFromTasks.splice(arrayPos, 1);

    const newToTasks = [...toCol.tasks];
    newToTasks.splice(toTaskIndex, 0, movedTask);

    const newColumns = [...columns];
    newColumns[fromColIndex] = { ...fromCol, tasks: newFromTasks };
    newColumns[toColIndex] = { ...toCol, tasks: newToTasks };
    setColumns(newColumns);
  }
};
