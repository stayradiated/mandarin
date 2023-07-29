import type { Range } from './types.js'
import { rangeContainsRange } from './range-contains-range.js'

// Does range contain point
export const rangeContainsPoint = (range: Range, point: number): boolean => {
  return range[0] <= point && range[1] > point
}

// Does a intersect b?
// ([0, 10], [5, 15]) === true
// ([0, 10], [10, 20]) ==== false
export const rangesIntersect = (a: Range, b: Range) => {
  return rangeContainsPoint(a, b[0]) || rangeContainsPoint(a, b[1] - 1)
}

// Sort a list of ranges by start index ascending
export const sortRangesByStart = (list: Range[]): Range[] => {
  return [...list].sort((a, b) => a[0] - b[0])
}

// Sort a list of ranges by end index descending
export const sortRangesByEnd = (list: Range[]): Range[] => {
  return [...list].sort((a, b) => b[1] - a[1])
}

// Subtract b from a
// returns a list of ranges
// that may contain 0, 1 or 2 ranges
// subtractRange([0, 20], [10, 20]) => [[0, 10]]
// subtractRange([0, 20], [5, 15]) => [[0, 5], [5, 15]]
// subtractRange([0, 20], [0, 20]) => []
export const subtractRange = (a: Range, b: Range): Range[] => {
  // B contains a
  if (a[0] >= b[0] && a[1] <= b[1]) {
    return []
  }

  // A contains b
  if (b[0] > a[0] && b[1] < a[1]) {
    return [
      [a[0], b[0]],
      [b[1], a[1]],
    ]
  }

  // A contains point b:end
  if (a[0] <= b[1] && a[1] > b[1]) {
    return [[b[1], a[1]]]
  }

  // A contains point b:start
  if (a[0] <= b[0] && a[1] > b[0]) {
    return [[a[0], b[0]]]
  }

  // A doesn't intersect b
  return [a]
}

// Clean a list of ranges so that they are sorted, deduped and overlaps merged
// [[20, 25], [0, 10], [5, 15]] => [[0, 15], [20, 25]]
export const clean = (list: Range[]): Range[] => {
  return sortRangesByStart(list).reduce<Range[]>((acc, range, index, array) => {
    // Check if range has already been covered
    const rangeHasBeenCovered = acc.some((_range) =>
      rangeContainsRange(_range, range),
    )
    if (rangeHasBeenCovered) {
      return acc
    }

    const start = range[0]
    let end = range[1]

    // Extend end as far as needed
    for (const [_start, _end] of array.slice(index + 1)) {
      if (end >= _start && end <= _end) {
        end = _end
      }
    }

    acc.push([start, end])
    return acc
  }, [])
}

// Check if a list of ranges covers a range
export const listContainsRange = (list: Range[], range: Range): boolean => {
  return clean(list).some((_range) => rangeContainsRange(_range, range))
}

// Get the keys of a map that are part of a range
export const filterListByRangeIntersect = (
  list: Range[],
  range: Range,
): Range[] => {
  return list.filter((item) => rangesIntersect(item, range))
}

// Adjust the start and end of a range to exclude ranges of a list
// does not split a range
// trimRange([[0, 5], [15, 20]], [0, 20]) => [5, 15]
// trimRange([[5, 15]], [0, 20]) => [0, 20]
export const trimRange = (list: Range[], range: Range): Range => {
  let [start, end] = range
  for (const _range of sortRangesByStart(list)) {
    if (rangeContainsPoint(_range, start)) {
      start = Math.min(_range[1], end)
    }
  }

  for (const _range of sortRangesByEnd(list)) {
    if (rangeContainsPoint(_range, end - 1)) {
      end = Math.max(_range[0], start)
    }
  }

  return [start, end]
}

// Find range - list
// subtractListFromRange([[5, 15]], [0, 20]) => [[0, 5], [15, 20]]
// subtractListFromRange([[0, 20]], [0, 20]) => []
export const subtractListFromRange = (list: Range[], range: Range): Range[] => {
  return list.reduce(
    (sublist, _range) => {
      return sublist.flatMap((s) => {
        const a = subtractRange(s, _range)
        return a
      })
    },
    [range],
  )
}

// Find listA - listB
// returns a new list
export const subtractRangeList = (listA: Range[], listB: Range[]): Range[] => {
  return listA.flatMap((range) => subtractListFromRange(listB, range))
}
