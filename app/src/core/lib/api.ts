import { HttpException } from "@/core/exceptions/http-exception";
import { BaseResponse } from "@/core/interfaces/base-response";
import { httpNotificationEmitter } from "@/core/lib/http-notification-observer";
import { Methods } from "@/core/types/methods";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptionsProps {
  method: Methods;
  body?: Record<string, unknown>;
}
export const api = async <T extends object>(
  url: string,
  options: ApiOptionsProps,
  headers?: Record<string, string>
): Promise<BaseResponse<T> | null> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: options.method,
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      httpNotificationEmitter.emitError(new HttpException(error.message));
      return null;
    }

    const data = (await response.json()) as BaseResponse<T>;

    if (data.message) {
      httpNotificationEmitter.emitNotifcation(data.message);
    }

    return data;
  } catch (error) {
    httpNotificationEmitter.emitError(
      new HttpException("Parece que el servidor o tu están teniendo problemas")
    );
    return null;
  }
};
