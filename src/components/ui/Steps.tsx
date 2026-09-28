type StepsProps = {
  steps: readonly string[];
  current: number;
  label?: string;
};

export function Steps({ steps, current, label = "Progress" }: StepsProps) {
  const total = steps.length;

  return (
    <nav aria-label={label}>
      <p className="text-sm font-medium text-muted">
        Step {current + 1} of {total}
      </p>
      <ol className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
        {steps.map((step, index) => {
          const isCurrent = index === current;
          const isComplete = index < current;
          return (
            <li key={step} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={[
                  "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold microtransition",
                  isCurrent
                    ? "bg-blue text-white"
                    : isComplete
                      ? "bg-navy text-white"
                      : "border border-border bg-white text-muted",
                ].join(" ")}
              >
                {index + 1}
              </span>
              <span
                className={[
                  "text-sm",
                  isCurrent ? "font-semibold text-navy" : "text-muted",
                ].join(" ")}
                aria-current={isCurrent ? "step" : undefined}
              >
                {step}
              </span>
              {index < total - 1 ? (
                <span aria-hidden="true" className="hidden text-border sm:inline">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
