"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { features } from "@/config/features";
import { forms } from "@/config/forms";
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
  urgency: "not-urgent",
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
  zip: "ZIP code",
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

export function EstimateForm() {
  const [values, setValues] = useState<EstimateFormValues>(initialValues);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [instance, setInstance] = useState(0);
  const successRef = useRef<HTMLDivElement>(null);

  const totalSteps = forms.stepTitles.length;
  const allServiceOptions = [...forms.serviceOptions, forms.serviceOtherOption];

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

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

    if (isHoneypotFilled(event)) {
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
    const result = await simulateSubmit();
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("idle");
      setErrors({ _form: result.reason });
    }
  }

  function handleReset() {
    setValues(initialValues);
    setStep(0);
    setErrors({});
    setStatus("idle");
    setInstance((current) => current + 1);
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-xl border border-success/30 bg-white p-6 md:p-8"
      >
        <h3 className="text-xl text-navy">{forms.successHeading}</h3>
        <p className="mt-3 text-text">{forms.successMessage}</p>
        <p className="mt-3 text-muted">{forms.successNote}</p>
        <Button type="button" className="mt-6" onClick={handleReset}>
          {forms.resetLabel}
        </Button>
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

      <div className="mt-8 flex flex-col gap-6">
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
              legend="Is this urgent?"
              value={values.urgency}
              onChange={(value) =>
                update("urgency", value as EstimateFormValues["urgency"])
              }
              options={forms.urgencyOptions}
              error={errors.urgency}
            />
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
              <PhotoPreview key={instance} id="estimate-photo" />
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
                <dt className="text-sm text-muted">Urgency</dt>
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
          <Button type="button" variant="outline" onClick={handleBack}>
            {forms.backLabel}
          </Button>
        ) : null}
        {isLastStep ? (
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting"
              ? forms.submittingLabel
              : forms.submitLabel}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
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
