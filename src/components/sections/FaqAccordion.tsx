"use client";

import { useState } from "react";
import type { FaqItem } from "@/types";
import { Icon } from "@/components/ui/Icon";

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                id={`faq-button-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-navy microtransition hover:bg-surface-muted"
              >
                <span>{item.question}</span>
                <Icon
                  name="chevron-down"
                  className={[
                    "h-5 w-5 shrink-0 text-blue transition-transform",
                    isOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-button-${item.id}`}
              hidden={!isOpen}
              className="px-5 pb-5"
            >
              <p className="text-muted">{item.answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
