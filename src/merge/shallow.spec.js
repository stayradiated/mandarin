import test from 'ava'

import shallowMerge from './shallow'

test('does what you would expect', (t) => {
  const oldValue = {
    a: 1,
    b: 2,
    c: 3
  }

  const newValue = {
    a: 100
  }

  const result = shallowMerge(newValue, oldValue)

  t.deepEqual(result, {
    a: 100,
    b: 2,
    c: 3
  })

  t.deepEqual(newValue, {
    a: 100
  })

  t.deepEqual(oldValue, {
    a: 1,
    b: 2,
    c: 3
  })
})
