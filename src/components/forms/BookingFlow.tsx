"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { forms } from "@/config/forms";
import type { BookingFormValues, SelectOption } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  SelectField,
  TextField,
} from "@/components/ui/Field";
import { Steps } from "@/components/ui/Steps";
import { collectErrors, bookingStepSchemas } from "@/lib/validation";

const initialValues: BookingFormValues = {
  service: "",
  date: "",
  timeRange: "",
  fullName: "",
  email: "",
  phone: "",
};

const fieldLabels: Record<string, string> = {
  service: "Service",
  date: "Preferred date",
  timeRange: "Time range",
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
};

function labelFor(options: readonly SelectOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function BookingFlow() {
  const [values, setValues] = useState<BookingFormValues>(initialValues);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "confirmed">(
    "idle",
  );
  const confirmationRef = useRef<HTMLDivElement>(null);

  const totalSteps = forms.bookingStepTitles.length;
  const allServiceOptions = [...forms.serviceOptions, forms.serviceOtherOption];
  const today = useMemo(
    () => new Date().toISOString().slice(0, 10),
    [],
  );

  useEffect(() => {
    if (status === "confirmed") confirmationRef.current?.focus();
  }, [status]);

  function update<K extends keyof BookingFormValues>(
    key: K,
    value: BookingFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!(String(key) in previous)) return previous;
      const next = { ...previous };
      delete next[String(key)];
      return next;
    });
  }

  function validateStep(index: number) {
    const schema = bookingStepSchemas[index];
    if (!schema) return {};
    return collectErrors(schema, values);
  }

  function handleNext() {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, totalSteps - 1));
  }

  function handleBack() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  }

  function handleConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let combined: Record<string, string> = {};
    let firstInvalid = -1;
    bookingStepSchemas.forEach((schema, index) => {
      const stepErrors = collectErrors(schema, values);
      if (Object.keys(stepErrors).length > 0) {
        if (firstInvalid === -1) firstInvalid = index;
        combined = { ...combined, ...stepErrors };
      }
    });

    if (Object.keys(combined).length > 0) {
      setErrors(combined);
      if (firstInvalid >= 0) setStep(firstInvalid);
      return;
    }

    setErrors({});
    setStatus("confirmed");
  }

  function handleReset() {
    setValues(initialValues);
    setStep(0);
    setErrors({});
    setStatus("idle");
  }

  if (status === "confirmed") {
    return (
      <div
        ref={confirmationRef}
        role="status"
        tabIndex={-1}
        className="rounded-xl border border-success/30 bg-white p-6"
      >
        <h3 className="text-xl text-navy">{forms.bookingConfirmation}</h3>
        <Button type="button" className="mt-6" onClick={handleReset}>
          {forms.resetLabel}
        </Button>
      </div>
    );
  }

  const errorKeys = Object.keys(errors);
  const isLastStep = step === totalSteps - 1;

  return (
    <form onSubmit={handleConfirm} noValidate>
      <Steps
        steps={forms.bookingStepTitles}
        current={step}
        label="Booking preview progress"
      />

      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {totalSteps}: {forms.bookingStepTitles[step]}
      </p>

      {errorKeys.length > 0 ? (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-error/40 bg-surface-muted p-4"
        >
          <p className="font-medium text-error">
            Please correct the following before continuing:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-text">
            {errorKeys.map((key) => (
              <li key={key}>
                <a
                  href={`#booking-${key}`}
                  className="underline underline-offset-2"
                >
                  {fieldLabels[key] ?? key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-6">
        {step === 0 ? (
          <SelectField
            id="booking-service"
            name="service"
            label="Which service do you need?"
            value={values.service}
            onChange={(value) => update("service", value)}
            options={allServiceOptions}
            placeholderLabel="Choose a service"
            error={errors.service}
            required
          />
        ) : null}

        {step === 1 ? (
          <>
            <TextField
              id="booking-date"
              name="date"
              label="Preferred date"
              type="date"
              min={today}
              value={values.date}
              onChange={(value) => update("date", value)}
              error={errors.date}
              required
            />
            <p className="rounded-lg bg-surface-muted p-4 text-sm text-muted">
              {forms.bookingDisclaimer}
            </p>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <SelectField
              id="booking-timeRange"
              name="timeRange"
              label="Preferred time range"
              value={values.timeRange}
              onChange={(value) => update("timeRange", value)}
              options={forms.timeRanges}
              placeholderLabel="Choose a time range"
              error={errors.timeRange}
              required
            />
            <p className="rounded-lg bg-surface-muted p-4 text-sm text-muted">
              {forms.bookingDisclaimer}
            </p>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <TextField
              id="booking-fullName"
              name="fullName"
              label="Full name"
              value={values.fullName}
              onChange={(value) => update("fullName", value)}
              autoComplete="name"
              error={errors.fullName}
              required
            />
            <TextField
              id="booking-email"
              name="email"
              label="Email"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={(value) => update("email", value)}
              autoComplete="email"
              error={errors.email}
              required
            />
            <TextField
              id="booking-phone"
              name="phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(value) => update("phone", value)}
              autoComplete="tel"
              error={errors.phone}
              required
            />
          </>
        ) : null}

        {step === 4 ? (
          <div>
            <h3 className="text-lg">{forms.reviewLabel}</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Service</dt>
                <dd className="font-medium text-text">
                  {labelFor(allServiceOptions, values.service)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Date</dt>
                <dd className="font-medium text-text">{values.date}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Time range</dt>
                <dd className="font-medium text-text">
                  {labelFor(forms.timeRanges, values.timeRange)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Name</dt>
                <dd className="font-medium text-text">{values.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Contact</dt>
                <dd className="font-medium text-text">
                  {values.email} &middot; {values.phone}
                </dd>
              </div>
            </dl>
            <p className="mt-6 rounded-lg bg-surface-muted p-4 text-sm text-muted">
              {forms.bookingDisclaimer}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {step > 0 ? (
          <Button
            key="back"
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            {forms.backLabel}
          </Button>
        ) : null}
        {isLastStep ? (
          <Button key="submit" type="submit">
            {forms.submitLabel}
          </Button>
        ) : (
          <Button key="next" type="button" onClick={handleNext}>
            {forms.nextLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
