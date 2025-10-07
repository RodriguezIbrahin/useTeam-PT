import { FieldErrors } from "react-hook-form";

export function getValidationError<T extends object>(err: FieldErrors<T>) {
  const formedErr = Object.entries(err);
  const errorMessage = formedErr[0][1]?.message;
  return errorMessage  ?? "Error desconocido";
}
