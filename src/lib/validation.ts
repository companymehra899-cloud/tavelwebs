import { z } from "zod";
import type { CalculatorError } from "./types";

export const positiveNumber = z.number().finite().positive();
export const nonNegativeNumber = z.number().finite().nonnegative();
export const travelersSchema = z.number().int().min(1).max(50);

export function parseNumberInput(value: string | number | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.replace(",", ".").trim();
  if (normalized === "") {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function firstIssue(error: z.ZodError): CalculatorError {
  const issue = error.issues[0];
  return {
    field: issue?.path[0] ? String(issue.path[0]) : undefined,
    message: issue?.message ?? "Please check your inputs.",
  };
}

export function requirePositive(value: number | null, message: string): asserts value is number {
  if (value === null || !Number.isFinite(value) || value <= 0) {
    throw new Error(message);
  }
}
