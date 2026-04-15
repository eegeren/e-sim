import { Prisma } from "@/generated/prisma/client";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/types/api";

type ApiErrorBody = ApiErrorResponse["error"];

export function jsonResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
) {
  return NextResponse.json<ApiErrorResponse>(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid request payload.", 400);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : "record";
      return errorResponse("CONFLICT", `A record with the same ${target} already exists.`, 400);
    }

    if (error.code === "P2025") {
      return errorResponse("NOT_FOUND", "Requested record was not found.", 404);
    }
  }

  if (error instanceof Error) {
    const status = "status" in error && typeof error.status === "number" ? error.status : 500;
    const code =
      "code" in error && typeof error.code === "string"
        ? error.code
        : status === 404
          ? "NOT_FOUND"
          : status === 400
            ? "BAD_REQUEST"
            : "INTERNAL_SERVER_ERROR";

    return errorResponse(code, error.message, status);
  }

  return errorResponse("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500);
}

export function createApiError(
  code: ApiErrorBody["code"],
  message: string,
  status: number,
) {
  const error = new Error(message) as Error & {
    code: string;
    status: number;
  };

  error.code = code;
  error.status = status;

  return error;
}
