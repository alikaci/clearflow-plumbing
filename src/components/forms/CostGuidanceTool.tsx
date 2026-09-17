"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { costTool } from "@/config/costTool";
import { forms } from "@/config/forms";
import type { PropertyTypeValue, UrgencyValue } from "@/types";
import { Button } from "@/components/ui/Button";
import { RadioGroupField, SelectField } from "@/components/ui/Field";

export function CostGuidanceTool({
  ctaHref = costTool.ctaHref,
}: {
  ctaHref?: string;
}) {
  const [service, setService] = useState("");
  const [urgency, setUrgency] = useState<UrgencyValue>("not-urgent");
  const [propertyType, setPropertyType] = useState<PropertyTypeValue>("house");
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const allServiceOptions = [...forms.serviceOptions, forms.serviceOtherOption];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!service) {
      setServiceError("Choose the service you are asking about.");
      setShowResult(false);
      return;
    }
    setServiceError(null);
    setShowResult(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-6">
        <SelectField
          id="cost-service"
          name="service"
          label="Which service are you asking about?"
          value={service}
          onChange={(value) => {
            setService(value);
            setServiceError(null);
            setShowResult(false);
          }}
          options={allServiceOptions}
          placeholderLabel="Choose a service"
          error={serviceError ?? undefined}
          required
        />

        <RadioGroupField
          id="cost-urgency"
          name="urgency"
          legend="How soon does this need attention?"
          value={urgency}
          onChange={(value) => setUrgency(value as UrgencyValue)}
          options={forms.urgencyOptions}
        />

        <RadioGroupField
          id="cost-propertyType"
          name="propertyType"
          legend="What type of property is this?"
          value={propertyType}
          onChange={(value) => setPropertyType(value as PropertyTypeValue)}
          options={forms.propertyTypes}
        />
      </div>

      <div className="mt-8">
        <Button type="submit">{costTool.heading}</Button>
      </div>

      <div role="status" aria-live="polite" className="mt-6">
        {showResult ? (
          <div className="rounded-lg border border-border bg-surface-muted p-5">
            <p className="text-text">{costTool.resultMessage}</p>
            <Button href={ctaHref} className="mt-4">
              {costTool.ctaLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
