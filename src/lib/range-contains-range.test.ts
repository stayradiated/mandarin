import { test, describe, expect } from 'vitest'
import { rangeContainsRange } from './range-contains-range.js'

describe('rangeContainsRange', () => {
  test(`
    0 1 2 3 4 5 6 7 8 9 10
a: [-------------------]
b: [-------------------]
`, () => {
    expect(rangeContainsRange([0, 10], [0, 10])).toBe(true)
  })

  test(`
    0 1 2 3 4 5 6 7 8 9 10
a:         [---]
b: [-------------------]
`, () => {
    expect(rangeContainsRange([0, 10], [4, 6])).toBe(true)
  })

  test(`
    0 1 2 3 4 5 6 7 8 9 10
a:         [---]
b: [-------------------]
`, () => {
    expect(rangeContainsRange([4, 6], [0, 10])).toBe(false)
  })

  test(`
    0 1 2 3 4 5 6 7 8 9 10
a: [-----------------]
b: [-------------------]
`, () => {
    expect(rangeContainsRange([0, 9], [0, 10])).toBe(false)
  })

  test(`
    0 1 2 3 4 5 6 7 8 9 10
a:   [-----------------]
b: [-------------------]
`, () => {
    expect(rangeContainsRange([1, 10], [0, 10])).toBe(false)
  })
})
