export type SubmissionResult =
  | { ok: true }
  | { ok: false; reason: string };

export type Submitter = () => Promise<SubmissionResult>;

/*
Simulated submitter.

No network request is made, nothing is stored, and no personal information is
logged. Failure behaviour is not triggered by any hidden production switch; a
failing submitter can only be injected by tests or tools.
*/
export const simulateSubmit: Submitter = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true }), 600);
  });
