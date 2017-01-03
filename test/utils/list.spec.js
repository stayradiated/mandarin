import test from 'ava'
import PirateMap from 'piratemap'

import {
  containsRange,
  rangeContainsPoint,
  rangesIntersect,
  clean,
  listContainsRange,
  mapContainsRange,
  mapKeysThatIntersectRange,
} from '../../lib/utils/list'

test('containsRange', (t) => {
  t.true(containsRange([0, 100], [0, 100]))
  t.true(containsRange([0, 100], [40, 50]))

  t.false(containsRange([40, 50], [0, 100]))
  t.false(containsRange([0, 100], [0, 101]))
  t.false(containsRange([50, 100], [49, 100]))
})

test('rangeContainsPoint', (t) => {
  t.true(rangeContainsPoint([5, 10], 5))
  t.true(rangeContainsPoint([5, 10], 6))
  t.true(rangeContainsPoint([5, 10], 7))
  t.true(rangeContainsPoint([5, 10], 8))
  t.true(rangeContainsPoint([5, 10], 9))

  t.false(rangeContainsPoint([5, 10], 4))
  t.false(rangeContainsPoint([5, 10], 10))
})

test('rangesIntersect', (t) => {
  const a = [5, 15]
  const b = [10, 20]
  const c = [15, 25]

  t.true(rangesIntersect(a, b))
  t.true(rangesIntersect(b, a))
  t.true(rangesIntersect(b, c))
  t.true(rangesIntersect(c, b))

  t.false(rangesIntersect(a, c))
  t.false(rangesIntersect(c, a))

  t.true(rangesIntersect([0, 2], [1, 2]))
  t.false(rangesIntersect([0, 1], [1, 2]))
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

test('mapContainsRange', (t) => {
  const testRange = [5, 25]
  const map = new PirateMap()
  map.set([0, 10], 1)
  t.false(mapContainsRange(map, testRange))
  map.set([20, 30], 2)
  t.false(mapContainsRange(map, testRange))
  map.set([10, 20], 3)
  t.true(mapContainsRange(map, testRange))
})

test('mapKeysThatIntersectRange', (t) => {
  const testRange = [10, 20]
  const map = new PirateMap()

  map.set([0, 10], true)
  t.deepEqual(
    mapKeysThatIntersectRange(map, testRange),
    [])

  map.set([5, 12], true)
  t.deepEqual(
    mapKeysThatIntersectRange(map, testRange),
    [[5, 12]])

  map.set([10, 15], true)
  t.deepEqual(
    mapKeysThatIntersectRange(map, testRange),
    [[5, 12], [10, 15]])

  map.set([15, 20], true)
  t.deepEqual(
    mapKeysThatIntersectRange(map, testRange),
    [[5, 12], [10, 15], [15, 20]])

  map.set([20, 25], true)
  t.deepEqual(
    mapKeysThatIntersectRange(map, testRange),
    [[5, 12], [10, 15], [15, 20]])
})
