import test from 'ava'

import createValueMergeFunction from '../../lib/merge/value'

test('merge a single value', (t) => {
  const mergeValue = createValueMergeFunction({
    getId: (value) => value.id,
  })

  const values = new Map([
    [1, {id: 1, name: 'George', age: 22}],
  ])

  const value = {
    id: 1,
    name: 'James',
  }

  const output = mergeValue(values, value)

  t.deepEqual(output.get(1), {
    id: 1,
    name: 'James',
    age: 22,
  })

  t.deepEqual(values.get(1), {
    id: 1,
    name: 'George',
    age: 22,
  })
})
