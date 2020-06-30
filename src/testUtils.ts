export function noThrow(fn) {
  try {
    fn()
  } catch (err) {
    return false
  }
  return true
}
