"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { forms } from "@/config/forms";
import { Button } from "@/components/ui/Button";

type SelectedPhoto = {
  url: string;
  name: string;
};

export function PhotoPreview({
  id,
  onPhotoCountChange,
}: {
  id: string;
  onPhotoCountChange?: (count: number) => void;
}) {
  const [photo, setPhoto] = useState<SelectedPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!photo) return;
    const url = photo.url;
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function clearInput() {
    if (inputRef.current) inputRef.current.value = "";
  }

  function reportCount(count: number) {
    onPhotoCountChange?.(count);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError(null);

    if (!file) {
      setPhoto(null);
      reportCount(0);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file such as a JPG or PNG.");
      setPhoto(null);
      reportCount(0);
      clearInput();
      return;
    }

    if (file.size > forms.photoMaxBytes) {
      setError("Choose an image that is 5 MB or smaller.");
      setPhoto(null);
      reportCount(0);
      clearInput();
      return;
    }

    setPhoto({ url: URL.createObjectURL(file), name: file.name });
    reportCount(1);
  }

  function handleRemove() {
    setPhoto(null);
    setError(null);
    reportCount(0);
    clearInput();
  }

  return (
    <div className="rounded-lg border border-border bg-surface-muted p-4">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {forms.photoLabel}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="file"
        accept="image/*"
        onChange={handleChange}
        aria-describedby={error ? `${id}-help ${id}-error` : `${id}-help`}
        aria-invalid={error ? true : undefined}
        className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
      />
      <p id={`${id}-help`} className="mt-2 text-sm text-muted">
        {forms.photoHelp}
      </p>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-error">
          {error}
        </p>
      ) : null}

      {photo ? (
        <div className="mt-4 flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview only, never uploaded */}
          <img
            src={photo.url}
            alt="Preview of the selected photo"
            className="h-24 w-32 rounded-lg border border-border object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">
              {photo.name}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={handleRemove}
            >
              {forms.photoRemoveLabel}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
