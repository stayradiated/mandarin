import { test, expect } from 'vitest'
import {
  rangeContainsPoint,
  rangesIntersect,
  subtractRange,
  clean,
  listContainsRange,
  filterListByRangeIntersect,
  trimRange,
  subtractListFromRange,
  subtractRangeList,
} from './range.js'
import type { Range } from './types.js'

test('rangeContainsPoint', () => {
  expect(rangeContainsPoint([5, 10], 5)).toBe(true)
  expect(rangeContainsPoint([5, 10], 6)).toBe(true)
  expect(rangeContainsPoint([5, 10], 7)).toBe(true)
  expect(rangeContainsPoint([5, 10], 8)).toBe(true)
  expect(rangeContainsPoint([5, 10], 9)).toBe(true)

  expect(rangeContainsPoint([5, 10], 4)).toBe(false)
  expect(rangeContainsPoint([5, 10], 10)).toBe(false)
})

test('rangesIntersect', () => {
  const a: Range = [5, 15]
  const b: Range = [10, 20]
  const c: Range = [15, 25]

  expect(rangesIntersect(a, b)).toBe(true)
  expect(rangesIntersect(b, a)).toBe(true)
  expect(rangesIntersect(b, c)).toBe(true)
  expect(rangesIntersect(c, b)).toBe(true)

  expect(rangesIntersect(a, c)).toBe(false)
  expect(rangesIntersect(c, a)).toBe(false)

  expect(rangesIntersect([0, 2], [1, 2])).toBe(true)
  expect(rangesIntersect([0, 1], [1, 2])).toBe(false)
})

test('subtractRange', () => {
  // B just before a
  expect(subtractRange([10, 20], [5, 10])).toStrictEqual([[10, 20]])

  // B just overlaps start of a
  expect(subtractRange([10, 20], [5, 11])).toStrictEqual([[11, 20]])

  // B start of  a
  expect(subtractRange([10, 20], [10, 15])).toStrictEqual([[15, 20]])

  // B overlaps start of a
  expect(subtractRange([10, 20], [9, 15])).toStrictEqual([[15, 20]])

  // B just after a
  expect(subtractRange([10, 20], [20, 25])).toStrictEqual([[10, 20]])

  // B just overlaps end of a
  expect(subtractRange([10, 20], [19, 25])).toStrictEqual([[10, 19]])

  // B end of a
  expect(subtractRange([10, 20], [15, 20])).toStrictEqual([[10, 15]])

  // B end of a
  expect(subtractRange([10, 20], [15, 21])).toStrictEqual([[10, 15]])

  // Same range
  expect(subtractRange([0, 20], [0, 20])).toStrictEqual([])

  // A contains b
  expect(subtractRange([0, 20], [5, 15])).toStrictEqual([
    [0, 5],
    [15, 20],
  ])
})

test('clean', () => {
  // Two seperate groups
  expect(
    clean([
      [40, 60],
      [0, 50],
      [80, 100],
      [70, 90],
    ]),
  ).toStrictEqual([
    [0, 60],
    [70, 100],
  ])

  // Three seperate groups
  expect(
    clean([
      [0, 1],
      [10, 11],
      [20, 21],
    ]),
  ).toStrictEqual([
    [0, 1],
    [10, 11],
    [20, 21],
  ])

  // The same group over and over again
  expect(
    clean([
      [0, 100],
      [0, 100],
      [0, 100],
    ]),
  ).toStrictEqual([[0, 100]])

  // Continous merges
  expect(
    clean([
      [0, 100],
      [100, 200],
      [200, 300],
      [300, 400],
    ]),
  ).toStrictEqual([[0, 400]])

  // Continous miss
  expect(
    clean([
      [0, 1],
      [2, 3],
      [4, 5],
    ]),
  ).toStrictEqual([
    [0, 1],
    [2, 3],
    [4, 5],
  ])

  // Put it all together!
  expect(
    clean([
      [0, 100],
      [50, 150],
      [250, 300],
      [100, 200],
      [40, 50],
    ]),
  ).toStrictEqual([
    [0, 200],
    [250, 300],
  ])
})

test('listContainsRange', () => {
  const list: Range[] = [
    [0, 10],
    [20, 30],
    [10, 20],
  ]
  const testRange: Range = [5, 25]
  expect(listContainsRange(list, testRange)).toBe(true)
})

test('filterListByRangeIntersect', () => {
  const testRange: Range = [10, 20]

  expect(filterListByRangeIntersect([[0, 10]], testRange)).toStrictEqual([])

  expect(
    filterListByRangeIntersect(
      [
        [0, 10],
        [5, 12],
      ],
      testRange,
    ),
  ).toStrictEqual([[5, 12]])

  expect(
    filterListByRangeIntersect(
      [
        [5, 12],
        [10, 15],
      ],
      testRange,
    ),
  ).toStrictEqual([
    [5, 12],
    [10, 15],
  ])

  expect(
    filterListByRangeIntersect(
      [
        [5, 12],
        [10, 15],
        [15, 20],
      ],
      testRange,
    ),
  ).toStrictEqual([
    [5, 12],
    [10, 15],
    [15, 20],
  ])

  expect(
    filterListByRangeIntersect(
      [
        [15, 20],
        [25, 30],
      ],
      testRange,
    ),
  ).toStrictEqual([[15, 20]])
})

test('trimRange', () => {
  expect(
    trimRange(
      [
        [0, 10],
        [90, 100],
      ],
      [0, 100],
    ),
  ).toStrictEqual([10, 90])

  expect(
    trimRange(
      [
        [5, 15],
        [20, 30],
      ],
      [10, 25],
    ),
  ).toStrictEqual([15, 20])

  expect(
    trimRange(
      [
        [10, 20],
        [0, 10],
      ],
      [0, 100],
    ),
  ).toStrictEqual([20, 100])

  expect(
    trimRange(
      [
        [90, 100],
        [80, 90],
      ],
      [0, 100],
    ),
  ).toStrictEqual([0, 80])

  expect(trimRange([[40, 60]], [0, 100])).toStrictEqual([0, 100])

  expect(
    trimRange(
      [
        [0, 90],
        [80, 200],
      ],
      [50, 150],
    ),
  ).toStrictEqual([150, 150])
})

test('subtractListFromRange', () => {
  expect(
    subtractListFromRange(
      [
        [5, 15],
        [15, 25],
      ],
      [10, 20],
    ),
  ).toStrictEqual([])

  expect(
    subtractListFromRange(
      [
        [10, 15],
        [20, 25],
        [30, 35],
      ],
      [5, 40],
    ),
  ).toStrictEqual([
    [5, 10],
    [15, 20],
    [25, 30],
    [35, 40],
  ])

  expect(subtractListFromRange([[5, 15]], [0, 20])).toStrictEqual([
    [0, 5],
    [15, 20],
  ])

  expect(subtractListFromRange([[0, 20]], [0, 20])).toStrictEqual([])
})

test('subtractRangeList', () => {
  expect(
    subtractRangeList(
      [[0, 50]],
      [
        [0, 10],
        [40, 50],
        [10, 20],
      ],
    ),
  ).toStrictEqual([[20, 40]])

  expect(
    subtractRangeList(
      [[20, 40]],
      [
        [30, 40],
        [20, 30],
      ],
    ),
  ).toStrictEqual([])

  expect(
    subtractRangeList(
      [
        [0, 100],
        [150, 250],
      ],
      [
        [40, 50],
        [80, 160],
        [200, 240],
      ],
    ),
  ).toStrictEqual([
    [0, 40],
    [50, 80],
    [160, 200],
    [240, 250],
  ])
})
