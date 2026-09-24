"use client";

import type { ReactNode } from "react";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FieldWrapper({ label, htmlFor, hint, error, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-ink shadow-[var(--shadow-sm)] transition placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

const labelClass = "text-xs font-semibold text-ink";

export interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  inputMode?: "text" | "numeric" | "decimal";
  type?: "text" | "number";
  step?: string;
  min?: string;
  max?: string;
  autoComplete?: string;
  prefix?: string;
  suffix?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  inputMode = "text",
  type = "text",
  step,
  min,
  max,
  autoComplete,
  prefix,
  suffix,
}: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} hint={hint} error={error}>
      {prefix || suffix ? (
        <div
          className={`flex items-stretch overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-sm)] transition focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 ${
            error ? "border-error" : ""
          }`}
        >
          {prefix ? <span className="flex items-center bg-surface-muted px-3 text-sm font-medium text-muted">{prefix}</span> : null}
          <input
            id={id}
            name={id}
            type={type}
            inputMode={inputMode}
            step={step}
            min={min}
            max={max}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={value}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-11 w-full bg-transparent px-3.5 py-2 text-sm text-ink outline-none placeholder:text-muted/70"
          />
          {suffix ? <span className="flex items-center border-l border-border bg-surface-muted px-3 text-sm font-medium text-muted">{suffix}</span> : null}
        </div>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          inputMode={inputMode}
          step={step}
          min={min}
          max={max}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} ${error ? "border-error focus:ring-error/15" : ""}`}
        />
      )}
    </FieldWrapper>
  );
}

export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
  error?: string;
}

export function SelectField({ id, label, value, onChange, options, hint, error }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} hint={hint} error={error}>
      <select
        id={id}
        name={id}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} ${error ? "border-error focus:ring-error/15" : ""}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
}

export function DateInput({ id, label, value, onChange, hint, error }: DateInputProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} hint={hint} error={error}>
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} ${error ? "border-error focus:ring-error/15" : ""}`}
      />
    </FieldWrapper>
  );
}

export { labelClass };
