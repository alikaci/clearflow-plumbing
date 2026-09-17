"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { serviceAreas } from "@/config/serviceAreas";
import { Button } from "@/components/ui/Button";
import { isZipInArea, isValidZip, sanitizeZipInput } from "@/lib/zip";

type ZipStatus = "idle" | "invalid" | "success" | "alternative";

export function ZipChecker({ id }: { id: string }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<ZipStatus>("idle");

  const message =
    status === "invalid"
      ? serviceAreas.invalidMessage
      : status === "success"
        ? serviceAreas.successMessage
        : status === "alternative"
          ? serviceAreas.alternativeMessage
          : "";

  const showReset = status === "success" || status === "alternative";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidZip(value)) {
      setStatus("invalid");
      return;
    }
    setStatus(isZipInArea(value, serviceAreas.zips) ? "success" : "alternative");
  }

  function handleReset() {
    setValue("");
    setStatus("idle");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-48">
          <label htmlFor={id} className="text-sm font-medium text-text">
            {serviceAreas.zipLabel}
          </label>
          <input
            id={id}
            name={id}
            value={value}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="43215"
            onChange={(event) => {
              setValue(sanitizeZipInput(event.target.value));
              setStatus("idle");
            }}
            aria-invalid={status === "invalid" ? true : undefined}
            aria-describedby={`${id}-help ${id}-result`}
            className={[
              "mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-base text-text shadow-sm focus-visible:border-blue focus-visible:outline-none",
              status === "invalid" ? "border-error" : "border-border",
            ].join(" ")}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">{serviceAreas.submitLabel}</Button>
          {showReset ? (
            <Button type="button" variant="outline" onClick={handleReset}>
              {serviceAreas.resetLabel}
            </Button>
          ) : null}
        </div>
      </div>

      <p id={`${id}-help`} className="mt-2 text-sm text-muted">
        {serviceAreas.zipHelp}
      </p>

      <div
        id={`${id}-result`}
        role="status"
        aria-live="polite"
        className="mt-3"
      >
        {message ? (
          <p
            className={
              status === "success"
                ? "font-medium text-success"
                : "font-medium text-error"
            }
          >
            {message}
          </p>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-muted">{serviceAreas.disclaimer}</p>
    </form>
  );
}
