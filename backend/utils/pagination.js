export function calculatePages(total, take) {
  return Math.ceil(total / take)
}