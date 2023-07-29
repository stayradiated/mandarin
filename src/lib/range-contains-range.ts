import type { Range } from './types.js'

// Does range a contain all of range b?
const rangeContainsRange = (a: Range, b: Range): boolean => {
  return b[0] >= a[0] && b[1] <= a[1]
}

export { rangeContainsRange }
