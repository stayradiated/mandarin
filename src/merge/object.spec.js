import test from 'ava'

import createObjectMergeFunction from './object'

test('merge an object of values', (t) => {
  const mergeObject = createObjectMergeFunction({
    getId: (value) => value.id
  })

  const values = new Map([
    [1, { id: 1, name: 'Adam', age: 11 }],
    [2, { id: 2, name: 'Bill', age: 21 }],
    [3, { id: 3, name: 'Charlie', age: 31 }]
  ])

  const object = {
    1: { id: 1, name: 'Arthur' },
    2: { id: 2, name: 'Brian' },
    3: { id: 3, name: 'Cameron' }
  }

  const output = mergeObject(values, object)

  t.deepEqual(output.get(1), {
    id: 1,
    name: 'Arthur',
    age: 11
  })
  t.deepEqual(output.get(2), {
    id: 2,
    name: 'Brian',
    age: 21
  })
  t.deepEqual(output.get(3), {
    id: 3,
    name: 'Cameron',
    age: 31
  })

  t.deepEqual(values.get(1), {
    id: 1,
    name: 'Adam',
    age: 11
  })
  t.deepEqual(values.get(2), {
    id: 2,
    name: 'Bill',
    age: 21
  })
  t.deepEqual(values.get(3), {
    id: 3,
    name: 'Charlie',
    age: 31
  })
})
