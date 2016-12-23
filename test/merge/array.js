import test from 'ava'

import createArrayMergeFunction from '../../lib/merge/array'

test('merge an array of values', (t) => {
  const mergeArray = createArrayMergeFunction({
    getId: (value) => value.id,
  })

  const values = new Map([
    [1, {id: 1, name: 'Adam', age: 11}],
    [2, {id: 2, name: 'Bill', age: 21}],
    [3, {id: 3, name: 'Charlie', age: 31}],
  ])

  const array = [
    {id: 1, name: 'Arthur'},
    {id: 2, name: 'Brian'},
    {id: 3, name: 'Cameron'},
  ]

  const output = mergeArray(values, array)

  t.deepEqual(output.get(1), {
    id: 1,
    name: 'Arthur',
    age: 11,
  })
  t.deepEqual(output.get(2), {
    id: 2,
    name: 'Brian',
    age: 21,
  })
  t.deepEqual(output.get(3), {
    id: 3,
    name: 'Cameron',
    age: 31,
  })

  t.deepEqual(values.get(1), {
    id: 1,
    name: 'Adam',
    age: 11,
  })
  t.deepEqual(values.get(2), {
    id: 2,
    name: 'Bill',
    age: 21,
  })
  t.deepEqual(values.get(3), {
    id: 3,
    name: 'Charlie',
    age: 31,
  })
})
