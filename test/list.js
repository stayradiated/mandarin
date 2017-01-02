import test from 'ava'

import {containsRange, clean, listContainsRange} from '../lib/list'

test('containsRange', (t) => {
  t.true(containsRange([0, 100], [0, 100]))
  t.true(containsRange([0, 100], [40, 50]))

  t.false(containsRange([40, 50], [0, 100]))
  t.false(containsRange([0, 100], [0, 101]))
  t.false(containsRange([50, 100], [49, 100]))
})

test('two overlapping groups', (t) => {
  const input = [[40, 60], [0, 50], [80, 100], [70, 90]]
  const expected = [[0, 60], [70, 100]]

  const actual = clean(input)
  t.deepEqual(actual, expected)
})

test('three seperate groups', (t) => {
  const input = [[0, 1], [10, 11], [20, 21]]
  const expected = [[0, 1], [10, 11], [20, 21]]

  const actual = clean(input)
  t.deepEqual(actual, expected)
})

test('the same group over and over again', (t) => {
  const input = [[0, 100], [0, 100], [0, 100]]
  const expected = [[0, 100]]

  const actual = clean(input)
  t.deepEqual(actual, expected)
})

test('continous merges', (t) => {
  const input = [[0, 100], [100, 200], [200, 300], [300, 400]]
  const expected = [[0, 400]]

  const actual = clean(input)
  t.deepEqual(actual, expected)
})

test('continous miss', (t) => {
  const input = [[0, 1], [2, 3], [4, 5]]
  const expected = [[0, 1], [2, 3], [4, 5]]

  const actual = clean(input)
  t.deepEqual(actual, expected)
})

test('put it all together!', (t) => {
  const input = [[0, 100], [50, 150], [250, 300], [100, 200], [40, 50]]
  const expected = [[0, 200], [250, 300]]

  const actual = clean(input)
  t.deepEqual(actual, expected)
})

test('listContainsRange', (t) => {
  const list = [[0, 10], [20, 30], [10, 20]]
  const testRange = [5, 25]
  t.true(listContainsRange(list, testRange))
})
