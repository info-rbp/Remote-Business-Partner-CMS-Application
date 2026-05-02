export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Swap spaces and underscores for hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
