import { test, expect } from 'vitest'
import { shallowMerge } from './shallow.js'

type Value = {
  a?: number
  b?: number
  c?: number
}

test('does what you would expect', () => {
  const oldValue: Value = {
    a: 1,
    b: 2,
    c: 3,
  }

  const newValue: Value = {
    a: 100,
  }

  const result = shallowMerge(newValue, oldValue)

  expect(result).toStrictEqual({
    a: 100,
    b: 2,
    c: 3,
  })

  // Make sure the original values are not mutated
  expect(newValue).toStrictEqual({
    a: 100,
  })
  expect(oldValue).toStrictEqual({
    a: 1,
    b: 2,
    c: 3,
  })
})
