const ZIP_PATTERN = /^\d{5}$/;

export function isValidZip(value: string): boolean {
  return ZIP_PATTERN.test(value.trim());
}

export function sanitizeZipInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

export function isZipInArea(
  value: string,
  zips: readonly string[],
): boolean {
  return isValidZip(value) && zips.includes(value.trim());
}
