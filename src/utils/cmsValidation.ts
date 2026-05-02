export function validateRequired(value: any, fieldName: string): string | null {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} is required.`;
  }
  return null;
}

export function validateLength(value: string, min: number, max: number, fieldName: string): string | null {
  const len = value?.length || 0;
  if (len < min) return `${fieldName} must be at least ${min} characters.`;
  if (len > max) return `${fieldName} must be at most ${max} characters.`;
  return null;
}
