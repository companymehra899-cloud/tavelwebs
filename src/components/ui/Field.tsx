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
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "min-h-11 w-full rounded-2xl border border-border bg-white px-3.5 py-2 text-sm text-foreground shadow-sm transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15";

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
}: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} hint={hint} error={error}>
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
        className={inputClass}
      />
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
        className={inputClass}
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
        className={inputClass}
      />
    </FieldWrapper>
  );
}

export { inputClass };
