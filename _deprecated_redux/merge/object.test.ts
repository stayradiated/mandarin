import { test, expect } from 'vitest'
import { createObjectMergeFunction } from './object.js'

type Value = {
  id: number
  name: string
  age?: number
}

test('merge an object of values', () => {
  const mergeObject = createObjectMergeFunction<number, Value>({
    getId: (value) => value.id,
  })

  const values = new Map<number, Value>([
    [1, { id: 1, name: 'Adam', age: 11 }],
    [2, { id: 2, name: 'Bill', age: 21 }],
    [3, { id: 3, name: 'Charlie', age: 31 }],
  ])

  const object: Record<string, Value> = {
    1: { id: 1, name: 'Arthur' },
    2: { id: 2, name: 'Brian' },
    3: { id: 3, name: 'Cameron' },
  }

  const output = mergeObject(values, object)

  expect(output.get(1)).toStrictEqual({
    id: 1,
    name: 'Arthur',
    age: 11,
  })
  expect(output.get(2)).toStrictEqual({
    id: 2,
    name: 'Brian',
    age: 21,
  })
  expect(output.get(3)).toStrictEqual({
    id: 3,
    name: 'Cameron',
    age: 31,
  })

  expect(values.get(1)).toStrictEqual({
    id: 1,
    name: 'Adam',
    age: 11,
  })
  expect(values.get(2)).toStrictEqual({
    id: 2,
    name: 'Bill',
    age: 21,
  })
  expect(values.get(3)).toStrictEqual({
    id: 3,
    name: 'Charlie',
    age: 31,
  })
})
