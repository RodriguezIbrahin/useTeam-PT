"use client";
import { validationErrorEmitter } from "@/core/lib/validation-error-observer";
import { httpNotificationEmitter } from "@/core/lib/http-notification-observer";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

export const SoonerListener = () => {
  useEffect(() => {
    const unsubscribeHttpNotification = httpNotificationEmitter.subscribe(
      (message, error) => {
        if (error) return toast.error(error.cause);
        return toast.success(message);
      }
    );
    const unsubscribeValidationError = validationErrorEmitter.subscribe(
      (err) => {
        toast(err.cause);
      }
    );
    return () => {
      unsubscribeHttpNotification();
      unsubscribeValidationError();
    };
  }, []);

  return (
    <>
      <Toaster />
    </>
  );
};
