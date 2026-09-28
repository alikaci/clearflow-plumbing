"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { business } from "@/config/business";
import { mainNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { filterNavigation } from "@/lib/features";
import { resolveHashHref } from "@/lib/links";
import { Wordmark } from "./Wordmark";

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navItems = filterNavigation(mainNavigation);
  const estimateHref = resolveHashHref(business.primaryCta.href, pathname);

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
    if (typeof window.matchMedia !== "function") return;
    const desktop = window.matchMedia("(min-width: 64rem)");
    const handleChange = () => {
      if (desktop.matches) closeMenu();
    };
    desktop.addEventListener("change", handleChange);
    return () => {
      desktop.removeEventListener("change", handleChange);
    };
  }, [open, pathname]);

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
        <Icon name="menu" />
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Site navigation"
        aria-modal="true"
        className="mobile-menu-dialog fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto p-0"
        onClick={handleBackdropClick}
      >
        <div
          className={[
            "ml-auto flex min-h-full w-full max-w-sm flex-col border-l border-border bg-white sm:w-96",
            open ? "mobile-menu-panel-enter" : "",
          ].join(" ")}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Wordmark />
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy hover:bg-surface-muted"
            >
              <Icon name="close" />
            </button>
          </div>

          <nav aria-label="Primary" className="flex-1 px-4 py-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "block rounded-lg px-3 py-3 text-lg font-medium microtransition",
                        active
                          ? "bg-blue-light font-semibold text-blue"
                          : "text-text hover:bg-surface-muted hover:text-blue",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 border-t border-border px-4 py-4">
            <Button href={estimateHref} variant="primary" size="lg" fullWidth>
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