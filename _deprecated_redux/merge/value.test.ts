import { test, expect } from 'vitest'
import { createValueMergeFunction } from './value.js'

type Value = {
  id: number
  name: string
}

test('merge a single value', () => {
  const mergeValue = createValueMergeFunction<number, Value>({
    getId: (value) => value.id,
  })

  const values = new Map([[1, { id: 1, name: 'George', age: 22 }]])

  const newValue = {
    id: 1,
    name: 'James',
  }

  const output = mergeValue(values, newValue)

  // Make sure the new value is merged
  expect(output.get(1)).toStrictEqual({
    id: 1,
    name: 'James',
    age: 22,
  })

  // Make sure the original values are not mutated
  expect(values.get(1)).toStrictEqual({
    id: 1,
    name: 'George',
    age: 22,
  })
})
