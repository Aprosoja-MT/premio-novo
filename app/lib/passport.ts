export function isValidPassport(value: string): boolean {
  return /^[A-Z]{2}\d{6}$/.test(value.toUpperCase());
}

export function maskPassport(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
}
