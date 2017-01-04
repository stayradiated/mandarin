import test from 'ava'

import {
  rangeSize,
  containsRange,
  rangeContainsPoint,
  rangesIntersect,
  subtractRange,
  clean,
  listContainsRange,
  filterListByRangeIntersect,
  trimRange,
  subtractListFromRange,
  subtractRangeList,
} from '../../lib/utils/list'

test('rangeSize', (t) => {
  t.is(1, rangeSize([0, 1]))
  t.is(0, rangeSize([0, 0]))
  t.is(5, rangeSize([5, 10]))
})

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

test('subtractRange', (t) => {
  // b just before a
  t.deepEqual(
    subtractRange([10, 20], [5, 10]),
    [[10, 20]])

  // b just overlaps start of a
  t.deepEqual(
    subtractRange([10, 20], [5, 11]),
    [[11, 20]])

  // b start of  a
  t.deepEqual(
    subtractRange([10, 20], [10, 15]),
    [[15, 20]])

  // b overlaps start of a
  t.deepEqual(
    subtractRange([10, 20], [9, 15]),
    [[15, 20]])

  // b just after a
  t.deepEqual(
    subtractRange([10, 20], [20, 25]),
    [[10, 20]])

  // b just overlaps end of a
  t.deepEqual(
    subtractRange([10, 20], [19, 25]),
    [[10, 19]])

  // b end of a
  t.deepEqual(
    subtractRange([10, 20], [15, 20]),
    [[10, 15]])

  // b end of a
  t.deepEqual(
    subtractRange([10, 20], [15, 21]),
    [[10, 15]])

  // same range
  t.deepEqual(
    subtractRange([0, 20], [0, 20]),
    [])

  // a contains b
  t.deepEqual(
    subtractRange([0, 20], [5, 15]),
    [[0, 5], [15, 20]])
})

test('clean', (t) => {
  // two seperate groups
  t.deepEqual(
    clean([[40, 60], [0, 50], [80, 100], [70, 90]]),
    [[0, 60], [70, 100]])

  // three seperate groups
  t.deepEqual(
    clean([[0, 1], [10, 11], [20, 21]]),
    [[0, 1], [10, 11], [20, 21]])

  // the same group over and over again
  t.deepEqual(
    clean([[0, 100], [0, 100], [0, 100]]),
    [[0, 100]])

  // continous merges
  t.deepEqual(
    clean([[0, 100], [100, 200], [200, 300], [300, 400]]),
    [[0, 400]])

  // continous miss
  t.deepEqual(
    clean([[0, 1], [2, 3], [4, 5]]),
    [[0, 1], [2, 3], [4, 5]])

  // put it all together!
  t.deepEqual(
    clean([[0, 100], [50, 150], [250, 300], [100, 200], [40, 50]]),
    [[0, 200], [250, 300]])
})

test('listContainsRange', (t) => {
  const list = [[0, 10], [20, 30], [10, 20]]
  const testRange = [5, 25]
  t.true(listContainsRange(list, testRange))
})

test('filterListByRangeIntersect', (t) => {
  const testRange = [10, 20]

  t.deepEqual(
    filterListByRangeIntersect([[0, 10]], testRange),
    [])

  t.deepEqual(
    filterListByRangeIntersect([[0, 10], [5, 12]], testRange),
    [[5, 12]])

  t.deepEqual(
    filterListByRangeIntersect([[5, 12], [10, 15]], testRange),
    [[5, 12], [10, 15]])

  t.deepEqual(
    filterListByRangeIntersect([[5, 12], [10, 15], [15, 20]], testRange),
    [[5, 12], [10, 15], [15, 20]])

  t.deepEqual(
    filterListByRangeIntersect([[15, 20], [25, 30]], testRange),
    [[15, 20]])
})

test('trimRange', (t) => {
  t.deepEqual(
    trimRange([[0, 10], [90, 100]], [0, 100]),
    [10, 90])

  t.deepEqual(
    trimRange([[5, 15], [20, 30]], [10, 25]),
    [15, 20])

  t.deepEqual(
    trimRange([[10, 20], [0, 10]], [0, 100]),
    [20, 100])

  t.deepEqual(
    trimRange([[90, 100], [80, 90]], [0, 100]),
    [0, 80])

  t.deepEqual(
    trimRange([[40, 60]], [0, 100]),
    [0, 100])

  t.deepEqual(
    trimRange([[0, 90], [80, 200]], [50, 150]),
    [150, 150])
})

test('subtractListFromRange', (t) => {
  t.deepEqual(
    subtractListFromRange([[5, 15], [15, 25]], [10, 20]),
    [])

  t.deepEqual(
    subtractListFromRange([[10, 15], [20, 25], [30, 35]], [5, 40]),
    [[5, 10], [15, 20], [25, 30], [35, 40]])

  t.deepEqual(
    subtractListFromRange([[5, 15]], [0, 20]),
    [[0, 5], [15, 20]])

  t.deepEqual(
    subtractListFromRange([[0, 20]], [0, 20]),
    [])
})

test('subtractRangeList', (t) => {
  t.deepEqual(
    subtractRangeList([[0, 50]], [[0, 10], [40, 50], [10, 20]]),
    [[20, 40]])

  t.deepEqual(
    subtractRangeList([[20, 40]], [[30, 40], [20, 30]]),
    [])

  t.deepEqual(
    subtractRangeList(
      [[0, 100], [150, 250]],
      [[40, 50], [80, 160], [200, 240]]),
    [[0, 40], [50, 80], [160, 200], [240, 250]])
})
