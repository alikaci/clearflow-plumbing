"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { assistant } from "@/config/assistant";
import { features } from "@/config/features";
import { Icon } from "@/components/ui/Icon";
import { resolveHashHref } from "@/lib/links";

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const active = assistant.choices.find((choice) => choice.id === activeId);

  function closeAssistant() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    document.documentElement.setAttribute("data-assistant-open", "true");
    panelRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.documentElement.removeAttribute("data-assistant-open");
    };
  }, [open]);

  if (!features.chatAssistant) return null;

  const positionClasses =
    "fixed right-4 bottom-[calc(var(--action-bar-height)+1rem)] z-50 lg:right-6 lg:bottom-6";

  return (
    <>
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={assistant.title}
          tabIndex={-1}
          className={`${positionClasses} flex max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-white shadow-lg`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border bg-navy px-4 py-3 text-white">
            <p className="font-semibold">{assistant.title}</p>
            <button
              type="button"
              onClick={closeAssistant}
              aria-label="Close website assistant"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <p className="text-sm text-text">{assistant.intro}</p>
            <p className="mt-2 text-sm text-muted">{assistant.disclaimer}</p>

            <ul className="mt-4 flex flex-col gap-2">
              {assistant.choices.map((choice) => (
                <li key={choice.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(choice.id)}
                    aria-pressed={activeId === choice.id}
                    className={[
                      "w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium",
                      activeId === choice.id
                        ? "border-blue bg-blue-light text-navy"
                        : "border-border bg-white text-text hover:border-blue",
                    ].join(" ")}
                  >
                    {choice.label}
                  </button>
                </li>
              ))}
            </ul>

            <div role="status" aria-live="polite" className="mt-4">
              {active ? (
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-sm text-text">{active.response}</p>
                  <Link
                    href={resolveHashHref(active.href, pathname)}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-2 hover:underline"
                  >
                    {active.hrefLabel}
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? closeAssistant() : setOpen(true))}
        aria-expanded={open}
        aria-label={open ? "Close website assistant" : "Open website assistant"}
        className={`${positionClasses} inline-flex min-h-12 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white shadow-lg hover:opacity-90`}
      >
        <Icon name="chat" className="h-5 w-5" />
        <span>{assistant.title}</span>
      </button>
    </>
  );
}
