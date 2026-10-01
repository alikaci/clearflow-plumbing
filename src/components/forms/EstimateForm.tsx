"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { business } from "@/config/business";
import { features } from "@/config/features";
import { forms } from "@/config/forms";
import { createDemoReference } from "@/lib/demo-reference";
import { getPostalCodeFieldLabel } from "@/lib/market";
import type { EstimateFormValues, SelectOption } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  CheckboxField,
  RadioGroupField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/Field";
import { Steps } from "@/components/ui/Steps";
import { simulateSubmit } from "@/lib/submit";
import { collectErrors, estimateStepSchemas } from "@/lib/validation";
import { PhotoPreview } from "./PhotoPreview";

const initialValues: EstimateFormValues = {
  service: "",
  city: "",
  zip: "",
  propertyType: "house",
  urgency: "getting-estimate",
  description: "",
  fullName: "",
  email: "",
  phone: "",
  contactMethod: "phone",
  contactTime: "morning",
  privacy: false,
};

const fieldLabels: Record<string, string> = {
  service: "Service",
  city: "City",
  zip: getPostalCodeFieldLabel(),
  propertyType: "Property type",
  urgency: "Urgency",
  description: "Problem description",
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  contactMethod: "Preferred contact method",
  contactTime: "Preferred contact time",
  privacy: "Demonstration notice",
};

function labelFor(
  options: readonly SelectOption[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

type SubmittedRequest = {
  values: EstimateFormValues;
  photoCount: number;
  reference: string;
};

function orNotProvided(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : forms.confirmationNotProvided;
}

function photoCountLabel(count: number): string {
  if (count < 1) return forms.confirmationNoPhotos;
  return `${count} ${count === 1 ? "photo" : "photos"} selected`;
}

export function EstimateForm() {
  const [values, setValues] = useState<EstimateFormValues>(initialValues);
  const [photoCount, setPhotoCount] = useState(0);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [submitted, setSubmitted] = useState<SubmittedRequest | null>(null);
  const [instance, setInstance] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const firstStepRef = useRef<HTMLDivElement>(null);
  const submitLockRef = useRef(false);
  const focusFormRef = useRef(false);

  const totalSteps = forms.stepTitles.length;
  const allServiceOptions = [...forms.serviceOptions, forms.serviceOtherOption];

  useEffect(() => {
    if (status === "success") confirmationRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!focusFormRef.current) return;
    focusFormRef.current = false;
    firstStepRef.current
      ?.querySelector<HTMLElement>("select, input, textarea, button")
      ?.focus();
  }, [resetCount]);

  function update<K extends keyof EstimateFormValues>(
    key: K,
    value: EstimateFormValues[K],
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
    const schema = estimateStepSchemas[index];
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLockRef.current) return;

    if (isHoneypotFilled(event)) {
      setSubmitted({
        values: { ...values },
        photoCount,
        reference: createDemoReference(),
      });
      setStatus("success");
      return;
    }

    let combined: Record<string, string> = {};
    let firstInvalidStep = -1;
    estimateStepSchemas.forEach((schema, index) => {
      const stepErrors = collectErrors(schema, values);
      if (Object.keys(stepErrors).length > 0) {
        if (firstInvalidStep === -1) firstInvalidStep = index;
        combined = { ...combined, ...stepErrors };
      }
    });

    if (Object.keys(combined).length > 0) {
      setErrors(combined);
      if (firstInvalidStep >= 0) setStep(firstInvalidStep);
      return;
    }

    setErrors({});
    setStatus("submitting");
    submitLockRef.current = true;
    try {
      const result = await simulateSubmit();
      if (result.ok) {
        setSubmitted({
          values: { ...values },
          photoCount,
          reference: createDemoReference(),
        });
        setStatus("success");
      } else {
        setStatus("idle");
        setErrors({ _form: result.reason });
      }
    } finally {
      submitLockRef.current = false;
    }
  }

  function handleReset() {
    setValues(initialValues);
    setPhotoCount(0);
    setStep(0);
    setErrors({});
    setStatus("idle");
    setSubmitted(null);
    setInstance((current) => current + 1);
    focusFormRef.current = true;
    setResetCount((current) => current + 1);
  }

  if (submitted) {
    const summary = submitted.values;
    return (
      <div>
        <p role="status" aria-live="polite" className="sr-only">
          {forms.confirmationStatus}
        </p>

        <div className="confirmation-in border-t-4 border-success pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-success">
            {forms.confirmationEyebrow}
          </p>
          <h3
            ref={confirmationRef}
            tabIndex={-1}
            className="mt-2 text-xl text-navy md:text-2xl"
          >
            {forms.confirmationHeading}
          </h3>

          <div className="mt-5 rounded-lg border border-border bg-surface-muted p-4">
            <p className="text-sm text-muted">
              {forms.confirmationReferenceLabel}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-[0.08em] text-navy">
              {submitted.reference}
            </p>
          </div>

          <p className="mt-5 rounded-lg border border-border bg-surface-muted p-4 text-sm text-text">
            {forms.confirmationDisclosure}
          </p>
          <p className="mt-4 text-sm text-muted">
            {forms.confirmationSupport}
          </p>

          <div className="mt-8">
            <h4 className="text-lg text-navy">
              {forms.confirmationSummaryHeading}
            </h4>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">
                  {forms.confirmationSummaryLabels.service}
                </dt>
                <dd className="font-medium text-text">
                  {labelFor(allServiceOptions, summary.service)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">
                  {forms.confirmationSummaryLabels.city}
                </dt>
                <dd className="font-medium text-text">
                  {orNotProvided(summary.city)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">
                  {forms.confirmationSummaryLabels.zip}
                </dt>
                <dd className="font-medium text-text">
                  {orNotProvided(summary.zip)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">
                  {forms.confirmationSummaryLabels.propertyType}
                </dt>
                <dd className="font-medium text-text">
                  {labelFor(forms.propertyTypes, summary.propertyType)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">
                  {forms.confirmationSummaryLabels.urgency}
                </dt>
                <dd className="font-medium text-text">
                  {labelFor(forms.urgencyOptions, summary.urgency)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">
                  {forms.confirmationSummaryLabels.contactPreference}
                </dt>
                <dd className="font-medium text-text">
                  {labelFor(forms.contactMethods, summary.contactMethod)},
                  best time to reach you:{" "}
                  {labelFor(forms.contactTimes, summary.contactTime).toLowerCase()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">
                  {forms.confirmationSummaryLabels.photos}
                </dt>
                <dd className="font-medium text-text">
                  {photoCountLabel(submitted.photoCount)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">
                  {forms.confirmationSummaryLabels.description}
                </dt>
                <dd className="font-medium whitespace-pre-line text-text">
                  {summary.description}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8">
            <h4 className="text-lg text-navy">
              {forms.confirmationLiveWebsiteHeading}
            </h4>
            <p className="mt-2 text-sm text-muted">
              {forms.confirmationLiveWebsiteNote}
            </p>

            <ol
              data-testid="confirmation-workflow-stages"
              aria-label={forms.confirmationLiveWebsiteHeading}
              className="mt-5 flex flex-wrap gap-x-2 gap-y-2"
            >
              {forms.confirmationWorkflowStages.map((stage, index) => (
                <li key={stage} className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-navy">
                    {stage}
                  </span>
                  {index < forms.confirmationWorkflowStages.length - 1 ? (
                    <span aria-hidden="true" className="text-border">
                      &rarr;
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            <ol className="mt-6 grid gap-5 sm:grid-cols-2">
              {forms.confirmationWorkflowSteps.map((item) => (
                <li key={item.step} className="rounded-lg border border-border bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-base font-bold text-white"
                    >
                      {item.step}
                    </span>
                    <div>
                      <h5 className="font-semibold text-navy">
                        {item.title}
                      </h5>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                        {item.owner}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>

            <div
              data-testid="confirmation-workflow-disclosure"
              className="mt-6 rounded-lg border border-error/40 bg-surface-muted p-4"
            >
              <h5 className="flex items-center gap-2 text-sm font-semibold text-navy">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 text-error"
                  fill="currentColor"
                >
                  <path d="M12 2 1 21h22L12 2Zm0 6 7.5 12h-15L12 8Zm-1 4v4h2v-4h-2Zm0 5v2h2v-2h-2Z" />
                </svg>
                {forms.confirmationWorkflowDisclosureHeading}
              </h5>
              <ul className="mt-3 grid gap-2">
                {forms.confirmationWorkflowDisclosureItems.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-text">
                    <span aria-hidden="true" className="mt-1.5 text-error">
                      &times;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={handleReset}>
              {forms.confirmationPrimaryLabel}
            </Button>
            <Button href="/" variant="outline">
              {forms.confirmationSecondaryLabel}
            </Button>
          </div>
          <p className="mt-4">
            <a
              href={business.phoneUri}
              className="inline-flex min-h-11 items-center font-semibold text-blue underline underline-offset-4"
            >
              Call {business.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    );
  }

  const errorKeys = Object.keys(errors).filter((key) => key !== "_form");
  const isLastStep = step === totalSteps - 1;

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
      <Steps steps={forms.stepTitles} current={step} label="Estimate request progress" />

      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {totalSteps}: {forms.stepTitles[step]}
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
                  href={`#estimate-${key}`}
                  className="underline underline-offset-2"
                >
                  {fieldLabels[key] ?? key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {errors._form ? (
        <p role="alert" className="mt-6 font-medium text-error">
          {errors._form}
        </p>
      ) : null}

      <div key={step} ref={firstStepRef} className="step-in mt-8 flex flex-col gap-6">
        {step === 0 ? (
          <SelectField
            id="estimate-service"
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
              id="estimate-city"
              name="city"
              label={forms.cityLabel}
              value={values.city}
              onChange={(value) => update("city", value)}
              autoComplete="address-level2"
              error={errors.city}
              required
            />
            <TextField
              id="estimate-zip"
              name="zip"
              label={forms.zipLabel}
              value={values.zip}
              onChange={(value) => update("zip", value.replace(/\D/g, "").slice(0, 5))}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              error={errors.zip}
              help="Five digits, for example 43215."
              required
            />
            <RadioGroupField
              id="estimate-propertyType"
              name="propertyType"
              legend="What type of property is this?"
              value={values.propertyType}
              onChange={(value) =>
                update("propertyType", value as EstimateFormValues["propertyType"])
              }
              options={forms.propertyTypes}
              error={errors.propertyType}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <RadioGroupField
              id="estimate-urgency"
              name="urgency"
              legend={forms.urgencyLegend}
              value={values.urgency}
              onChange={(value) =>
                update("urgency", value as EstimateFormValues["urgency"])
              }
              options={forms.urgencyOptions}
              help={forms.urgencyHelp}
              error={errors.urgency}
            />
            <div
              data-testid="estimate-urgency-safety"
              className="rounded-lg border-2 border-error/40 bg-surface-muted p-4"
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-navy">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 text-error"
                  fill="currentColor"
                >
                  <path d="M12 2 1 21h22L12 2Zm0 6 7.5 12h-15L12 8Zm-1 4v4h2v-4h-2Zm0 5v2h2v-2h-2Z" />
                </svg>
                {forms.urgencySafetyHeading}
              </h3>
              <p className="mt-2 text-sm text-text">
                {forms.urgencySafetyBody}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href={business.phoneUri}
                  className="inline-flex min-h-11 items-center font-semibold text-blue underline underline-offset-4"
                >
                  {forms.urgencySafetyCallLabel}: {business.phoneDisplay}
                </a>
                <Link
                  href="/emergency"
                  className="inline-flex min-h-11 items-center font-semibold text-blue underline underline-offset-4"
                >
                  {forms.urgencySafetyLinkLabel}
                </Link>
              </div>
            </div>
            <TextAreaField
              id="estimate-description"
              name="description"
              label={forms.descriptionLabel}
              value={values.description}
              onChange={(value) => update("description", value)}
              help={forms.descriptionHelp}
              error={errors.description}
              maxLength={2000}
              required
            />
            {features.photoUploadPreview ? (
              <PhotoPreview
                key={instance}
                id="estimate-photo"
                onPhotoCountChange={setPhotoCount}
              />
            ) : null}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <TextField
              id="estimate-fullName"
              name="fullName"
              label="Full name"
              value={values.fullName}
              onChange={(value) => update("fullName", value)}
              autoComplete="name"
              error={errors.fullName}
              required
            />
            <TextField
              id="estimate-email"
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
              id="estimate-phone"
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
            <RadioGroupField
              id="estimate-contactMethod"
              name="contactMethod"
              legend="How should the team follow up?"
              value={values.contactMethod}
              onChange={(value) =>
                update("contactMethod", value as EstimateFormValues["contactMethod"])
              }
              options={forms.contactMethods}
              error={errors.contactMethod}
            />
            <RadioGroupField
              id="estimate-contactTime"
              name="contactTime"
              legend="When is the best time to reach you?"
              value={values.contactTime}
              onChange={(value) =>
                update("contactTime", value as EstimateFormValues["contactTime"])
              }
              options={forms.contactTimes}
              error={errors.contactTime}
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
                <dt className="text-sm text-muted">Location</dt>
                <dd className="font-medium text-text">
                  {values.city}, {values.zip}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Property type</dt>
                <dd className="font-medium text-text">
                  {labelFor(forms.propertyTypes, values.propertyType)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Timing</dt>
                <dd className="font-medium text-text">
                  {labelFor(forms.urgencyOptions, values.urgency)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">Problem description</dt>
                <dd className="font-medium text-text">{values.description}</dd>
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
              <div>
                <dt className="text-sm text-muted">Follow-up</dt>
                <dd className="font-medium text-text">
                  {labelFor(forms.contactMethods, values.contactMethod)},{" "}
                  {labelFor(forms.contactTimes, values.contactTime)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <CheckboxField
                id="estimate-privacy"
                name="privacy"
                label={forms.privacyLabel}
                checked={values.privacy}
                onChange={(checked) => update("privacy", checked)}
                error={errors.privacy}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="estimate-company">Company website</label>
        <input
          id="estimate-company"
          name={forms.honeypotFieldName}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
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
          <Button key="submit" type="submit" disabled={status === "submitting"}>
            {status === "submitting"
              ? forms.submittingLabel
              : forms.submitLabel}
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

function isHoneypotFilled(event: FormEvent<HTMLFormElement>): boolean {
  const data = new FormData(event.currentTarget);
  const value = data.get(forms.honeypotFieldName);
  return typeof value === "string" && value.trim().length > 0;
}
