"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AssistantMessage } from "@/types";
import { assistant } from "@/config/assistant";
import { features } from "@/config/features";
import { Icon } from "@/components/ui/Icon";
import { matchIntent, resolveMatch } from "@/lib/assistant-intents";

/*
ClearFlow Guide: a scripted, guided assistant.

This component is a thin view over two pure pieces of config and logic:
src/config/assistant.ts (copy + keyword/phrase terms) and
src/lib/assistant-intents.ts (normalization and scoring). It performs local
keyword routing only: no model, no API, no backend, no storage. Messages live in
React state, so a reload starts a new conversation.

The established accessible names are preserved exactly: the launcher is
"Open website assistant" / "Close website assistant" and the dialog is named
"Website assistant". The visible header shows the ClearFlow Guide identity with
a "Guided demo" label instead, which never implies a live person.
*/

type MessageList = readonly AssistantMessage[];

const MATCH_OPTIONS = {
  safetyIntent: assistant.safetyIntent,
  fallback: assistant.fallback,
  intents: assistant.intents,
} as const;

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<MessageList>([]);
  const [draft, setDraft] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef(0);
  const pathname = usePathname();
  const panelId = "assistant-panel";

  const hasConversation = messages.length > 0;

  /*
  Message ids are a deterministic counter rather than anything random, so the
  first client render matches the server render and hydration stays stable.
  */
  const nextId = useCallback((role: "user" | "assistant") => {
    sequenceRef.current += 1;
    return `${role}-${sequenceRef.current}`;
  }, []);

  const submit = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, assistant.maxLength);
      if (text.length === 0) return;

      const userMessage: AssistantMessage = {
        id: nextId("user"),
        role: "user",
        text,
      };
      const match = matchIntent(text, MATCH_OPTIONS);
      const reply = resolveMatch(match, pathname);
      const assistantMessage: AssistantMessage = {
        id: nextId("assistant"),
        role: "assistant",
        text: reply.text,
        actions: reply.actions,
        variant: reply.variant,
      };

      setMessages((current) => [...current, userMessage, assistantMessage]);
      setDraft("");
    },
    [nextId, pathname],
  );

  function closeAssistant() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  function startOver() {
    // Resets the visible conversation and the id counter together so the next
    // turn starts from a clean, predictable sequence.
    sequenceRef.current = 0;
    setMessages([]);
    setDraft("");
    inputRef.current?.focus();
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

  // Keep the newest turn in view as the conversation grows.
  useEffect(() => {
    if (!hasConversation) return;
    const log = logRef.current;
    if (log && typeof log.scrollTo === "function") {
      log.scrollTo({ top: log.scrollHeight });
    }
  }, [hasConversation, messages]);

  const composerHintId = useMemo(() => "assistant-composer-hint", []);

  if (!features.chatAssistant) return null;

  // Sit above the action bar's real height (safe-area inset included) plus a
  // shared gap. On desktop the bar is hidden and lg:bottom-6 takes over.
  const positionClasses =
    "fixed right-4 bottom-[calc(var(--mobile-action-bar-height)+var(--mobile-floating-gap))] z-50 lg:right-6 lg:bottom-6";

  /*
  The launcher stays in the DOM while the panel is open, because it is the
  disclosure toggle and focus returns to it on close. That means the panel is
  raised by exactly one launcher height so the toggle cannot cover the
  composer or the send control underneath it. The action bar is hidden while
  the panel is open, so its measured height reads 0px here and the reserved
  space is only the shared gap.
  */
  const panelClasses =
    "fixed right-4 bottom-[calc(var(--mobile-action-bar-height)+var(--mobile-floating-gap)+3rem)] z-50 max-h-[min(32rem,calc(100dvh_-_var(--mobile-action-bar-height)_-_var(--mobile-floating-gap)_-_3rem))] lg:right-6 lg:bottom-[4.5rem] lg:max-h-[min(32rem,calc(100dvh_-_4.5rem))]";

  return (
    <>
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={assistant.dialogLabel}
          tabIndex={-1}
          data-floating-control=""
          className={`${panelClasses} flex w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border bg-navy px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10"
              >
                <Icon name="chat" className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{assistant.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-white/75">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/60"
                  />
                  {assistant.statusLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeAssistant}
              aria-label="Close website assistant"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-white/10"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          {/*
          role="log" is the standard chat pattern: it announces newly appended
          content politely without duplicating what is already on screen, and it
          does not re-announce the composer or the typing-free welcome state.
          tabIndex is explicit because the log is the scrollable region: without
          it, a keyboard user in a browser that does not focus scrollers
          automatically cannot scroll the conversation.
          */}
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Conversation"
            tabIndex={0}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {hasConversation ? null : (
              <>
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface-muted px-4 py-3 text-sm text-text">
                  <p>{assistant.welcome}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs leading-relaxed text-muted">
                    {assistant.explanation}
                  </p>
                  <ul className="space-y-1.5">
                    {assistant.disclosures.map((disclosure) => (
                      <li
                        key={disclosure}
                        className="flex gap-2 text-xs leading-relaxed text-muted"
                      >
                        <Icon
                          name="check"
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue"
                        />
                        <span>{disclosure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          <div className="space-y-2 border-t border-border bg-white px-3 py-3">
            {hasConversation ? (
              <div className="flex flex-wrap gap-2">
                {assistant.quickPrompts.slice(0, 3).map((prompt) => (
                  <button
                    key={prompt.label}
                    type="button"
                    onClick={() => submit(prompt.text)}
                    className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text microtransition hover-on:border-blue hover-on:text-blue"
                  >
                    {prompt.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={startOver}
                  className="ml-auto rounded-full px-2 py-1.5 text-xs font-semibold text-muted underline underline-offset-2 microtransition hover:text-navy"
                >
                  {assistant.startOverLabel}
                </button>
              </div>
            ) : (
              <ul className="-mx-1 flex flex-wrap gap-1.5" aria-label="Suggested questions">
                {assistant.quickPrompts.map((prompt) => (
                  <li key={prompt.label}>
                    <button
                      type="button"
                      onClick={() => submit(prompt.text)}
                      className="min-h-9 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text microtransition hover-on:border-blue hover-on:text-blue"
                    >
                      {prompt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit(draft);
              }}
            >
              <label htmlFor="assistant-input" className="sr-only">
                {assistant.inputLabel}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-white p-1.5 focus-within:border-blue">
                <input
                  ref={inputRef}
                  id="assistant-input"
                  name="assistant-input"
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={assistant.maxLength}
                  placeholder={assistant.inputPlaceholder}
                  aria-describedby={composerHintId}
                  autoComplete="off"
                  className="min-h-10 min-w-0 flex-1 bg-transparent px-2 text-sm text-text outline-none placeholder:text-muted"
                />
                <button
                  type="submit"
                  disabled={draft.trim().length === 0}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-orange px-3 text-sm font-semibold text-navy disabled:pointer-events-none disabled:opacity-50"
                >
                  {assistant.sendLabel}
                  <Icon name="arrow-right" className="h-4 w-4" />
                </button>
              </div>
              <p id={composerHintId} className="mt-1.5 text-xs text-muted">
                Answers come from this site&rsquo;s configured information. Nothing you type is
                sent or stored.
              </p>
            </form>
          </div>
        </div>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        data-floating-control=""
        data-assistant-launcher=""
        onClick={() => (open ? closeAssistant() : setOpen(true))}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close website assistant" : "Open website assistant"}
        className={`${positionClasses} inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white shadow-lg hover:opacity-90 max-[26rem]:h-12 max-[26rem]:w-12 max-[26rem]:p-0`}
      >
        <Icon name="chat" className="h-5 w-5" />
        <span className="max-[26rem]:hidden">{assistant.name}</span>
      </button>
    </>
  );
}

function MessageBubble({ message }: { message: AssistantMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p
          data-message-role="user"
          className="max-w-[85%] rounded-2xl rounded-br-sm bg-navy px-4 py-2.5 text-sm text-white"
        >
          {message.text}
        </p>
      </div>
    );
  }

  const isSafety = message.variant === "safety";

  return (
    <div
      data-message-role="assistant"
      className={[
        "max-w-[88%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm",
        isSafety
          ? "border border-orange/50 bg-orange/10 text-text"
          : "bg-surface-muted text-text",
      ].join(" ")}
    >
      {isSafety ? (
        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-orange">
          <Icon name="alert" className="h-4 w-4" />
          Safety first
        </p>
      ) : null}
      <p>{message.text}</p>
      {message.actions && message.actions.length > 0 ? (
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {message.actions.map((action) => (
            <li key={`${message.id}-${action.href}-${action.label}`}>
              <Link
                href={action.href}
                className="inline-link-arrow inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-blue"
              >
                {action.label}
                <Icon name="arrow-right" className="inline-link-arrow-icon h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
