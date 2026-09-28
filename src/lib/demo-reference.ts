const prefix = "CF-DEMO-";
const digits = 6;

export const demoReferencePattern = new RegExp(`^${prefix}\\d{${digits}}$`);

function randomDigitSource(): () => number {
  const webCrypto = globalThis.crypto;
  if (webCrypto && typeof webCrypto.getRandomValues === "function") {
    return () => {
      const buffer = new Uint32Array(1);
      webCrypto.getRandomValues(buffer);
      return buffer[0] / 0x100000000;
    };
  }
  return () => Math.random();
}

/*
Display-only reference for the simulated request.

It carries no meaning, is not an appointment or job number, and is never sent,
stored, or placed in a URL. Call it from a client event so server rendering and
hydration never produce different values.
*/
export function createDemoReference(): string {
  const nextRandom = randomDigitSource();
  let value = "";
  for (let index = 0; index < digits; index += 1) {
    value += Math.floor(nextRandom() * 10);
  }
  return `${prefix}${value.padStart(digits, "0")}`;
}
