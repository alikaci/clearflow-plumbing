import type { ReactNode } from "react";
import type { SelectOption } from "@/types";

const baseInputClasses =
  "mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-base text-text shadow-sm transition-colors placeholder:text-muted/70 focus-visible:border-blue focus-visible:outline-none";

function inputClasses(hasError: boolean): string {
  return [baseInputClasses, hasError ? "border-error" : ""]
    .filter(Boolean)
    .join(" ");
}

function describedBy(
  id: string,
  help: string | undefined,
  error: string | undefined,
): string | undefined {
  const ids = [
    help ? `${id}-help` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-text">
      {children}
      {required ? (
        <>
          <span aria-hidden="true" className="text-error">
            {" "}
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : null}
    </label>
  );
}

function HelpText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-muted">
      {children}
    </p>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-error">
      {children}
    </p>
  );
}

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "date";
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
  help?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  min?: string;
  placeholder?: string;
};

export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  autoComplete,
  help,
  error,
  required,
  maxLength,
  min,
  placeholder,
}: TextFieldProps) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        maxLength={maxLength}
        min={min}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, help, error)}
        className={inputClasses(Boolean(error))}
      />
      {help ? <HelpText id={`${id}-help`}>{help}</HelpText> : null}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

type TextAreaFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
};

export function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  help,
  error,
  required,
  rows = 5,
  maxLength,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, help, error)}
        className={inputClasses(Boolean(error))}
      />
      {help ? <HelpText id={`${id}-help`}>{help}</HelpText> : null}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholderLabel: string;
  help?: string;
  error?: string;
  required?: boolean;
};

export function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholderLabel,
  help,
  error,
  required,
}: SelectFieldProps) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, help, error)}
        className={inputClasses(Boolean(error))}
      >
        <option value="">{placeholderLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {help ? <HelpText id={`${id}-help`}>{help}</HelpText> : null}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

type RadioGroupFieldProps = {
  id: string;
  name: string;
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  help?: string;
  error?: string;
};

export function RadioGroupField({
  id,
  name,
  legend,
  value,
  onChange,
  options,
  help,
  error,
}: RadioGroupFieldProps) {
  return (
    <fieldset aria-describedby={describedBy(id, help, error)}>
      <legend className="text-sm font-medium text-text">{legend}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={[
                "flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-2.5 text-sm",
                checked ? "border-blue bg-blue-light" : "border-border",
              ].join(" ")}
            >
              <input
                id={optionId}
                name={name}
                type="radio"
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 accent-blue"
              />
              <span className="font-medium text-text">{option.label}</span>
            </label>
          );
        })}
      </div>
      {help ? <HelpText id={`${id}-help`}>{help}</HelpText> : null}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </fieldset>
  );
}

type CheckboxFieldProps = {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

export function CheckboxField({
  id,
  name,
  label,
  checked,
  onChange,
  error,
}: CheckboxFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-blue"
        />
        <span className="text-sm text-text">{label}</span>
      </label>
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}
