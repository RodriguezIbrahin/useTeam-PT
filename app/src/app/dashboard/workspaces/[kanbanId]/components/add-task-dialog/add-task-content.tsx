import { Button } from "@/core/components/ui/button";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";

export const AddTaskContent = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Agregar nueva tarea</DialogTitle>
      </DialogHeader>
      <form className="grid gap-4 py-4">
        <div className="min-w-sm grid justify-self-center">
          <Label className="mb-2">Titulo de la tarea</Label>
          <Input type="text" placeholder="Ej. Diseñar la nueva landing page" />

          <Label className="mt-4 mb-2">Descripción</Label>
          <Input
            type="text"
            placeholder="Ej. Crear un diseño moderno y atractivo para la nueva landing page del producto."
          />

          <Label className="mt-4 mb-2">Asignar a</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label className="mt-4 mb-2">Prioridad</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancelar</Button>
          </DialogClose>
          <Button>Agregar</Button>
        </DialogFooter>
      </form>
    </>
  );
};
