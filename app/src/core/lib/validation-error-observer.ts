import { ValidationException } from "@/exceptions/validation-exception";

type Listener = (error: ValidationException) => void;

class ValidationErrorEmitter {
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(error: ValidationException) {
    this.listeners.forEach((listener) => listener(error));
  }
}

export const validationErrorEmitter = new ValidationErrorEmitter();
