"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { business } from "@/config/business";
import { mainNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "./Wordmark";

export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    document.documentElement.setAttribute("data-shell-menu-open", "true");
    dialog.showModal();
    setOpen(true);
  }

  function closeMenu() {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) dialog.close();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setOpen(false);
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
      document.documentElement.removeAttribute("data-shell-menu-open");
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelector<HTMLElement>("a[href], button:not([disabled])");
    focusable?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) closeMenu();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy hover:bg-surface-muted"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Site navigation"
        aria-modal="true"
        className="mobile-menu-dialog fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto p-0"
        onClick={handleBackdropClick}
      >
        <div className="ml-auto flex min-h-full w-full max-w-sm flex-col border-l border-border bg-white sm:w-96">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Wordmark />
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy hover:bg-surface-muted"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Primary" className="flex-1 px-4 py-4">
            <ul className="flex flex-col gap-1">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-3 text-lg font-medium text-text hover:bg-surface-muted hover:text-blue"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
            <Button href={business.primaryCta.href} variant="primary" size="lg" fullWidth>
              {business.primaryCta.label}
            </Button>
            <Button href={business.secondaryCta.href} variant="outline" size="lg" fullWidth>
              {business.secondaryCta.label}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}