import { test, describe, expect } from 'vitest'
import { rangeLength } from './range-length.js'

describe('rangeLength', () => {
  test(`
 0 1 2 3 4 5 6 7 8 9 10
[-------------------]
`, () => {
    expect(rangeLength([0, 10])).toBe(10)
  })

  test(`
 0 1 2 3 4 5 6 7 8 9 10
[]
`, () => {
    expect(rangeLength([0, 0])).toBe(0)
  })

  test(`
 0 1 2 3 4 5 6 7 8 9 10
          [---------]
`, () => {
    expect(rangeLength([5, 10])).toBe(5)
  })
})
