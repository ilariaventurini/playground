export function isValidDate(d: Date) {
  return !isNaN(d.getTime())
}
