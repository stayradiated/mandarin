import type { Range } from './types.js'

// Get the length of a range
const rangeLength = (range: Range): number => {
  return range[1] - range[0]
}

export { rangeLength }
