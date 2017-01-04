const flatten = (arr, i) => arr.concat(i)

// get the length of a range
export function rangeSize (range) {
  return range[1] - range[0]
}

// does a contain b?
export function containsRange (a, b) {
  return b[0] >= a[0] && b[1] <= a[1]
}

// does range contain point
export function rangeContainsPoint (range, point) {
  return range[0] <= point && range[1] > point
}

// does a intersect b?
// ([0, 10], [5, 15]) === true
// ([0, 10], [10, 20]) ==== false
export function rangesIntersect (a, b) {
  return (
    rangeContainsPoint(a, b[0]) ||
    rangeContainsPoint(a, b[1] - 1)
  )
}

// sort a list of ranges by start index ascending
export function sortRangesByStart (list) {
  return [...list].sort((a, b) => a[0] - b[0])
}

// sort a list of ranges by end index descending
export function sortRangesByEnd (list) {
  return [...list].sort((a, b) => b[1] - a[1])
}

// subtract b from a
// returns a list of ranges
// that may contain 0, 1 or 2 ranges
// subtractRange([0, 20], [10, 20]) => [[0, 10]]
// subtractRange([0, 20], [5, 15]) => [[0, 5], [5, 15]]
// subtractRange([0, 20], [0, 20]) => []
export function subtractRange (a, b) {
  // b contains a
  if (a[0] >= b[0] && a[1] <= b[1]) {
    return []
  }
  // a contains b
  if (b[0] > a[0] && b[1] < a[1]) {
    return [[a[0], b[0]], [b[1], a[1]]]
  }
  // a contains point b:end
  if (a[0] <= b[1] && a[1] > b[1]) {
    return [[b[1], a[1]]]
  }
  // a contains point b:start
  if (a[0] <= b[0] && a[1] > b[0]) {
    return [[a[0], b[0]]]
  }
  // a doesn't intersect b
  return [a]
}

// clean a list of ranges so that they are sorted, deduped and overlaps merged
// [[20, 25], [0, 10], [5, 15]] => [[0, 15], [20, 25]]
export function clean (list) {
  return sortRangesByStart(list).reduce((acc, range, index, arr) => {
    // check if range has already been covered
    const rangeHasBeenCovered = (
      acc.some((_range) => containsRange(_range, range)))
    if (rangeHasBeenCovered) {
      return acc
    }

    const start = range[0]
    let end = range[1]

    // extend end as far as needed
    arr.slice(index + 1).forEach(([_start, _end]) => {
      if (end >= _start && end <= _end) {
        end = _end
      }
    })

    acc.push([start, end])
    return acc
  }, [])
}

// check if a list of ranges covers a range
export function listContainsRange (list, range) {
  return clean(list).some((_range) => containsRange(_range, range))
}

// get the keys of a map that are part of a range
export function filterListByRangeIntersect (list, range) {
  return list.filter(rangesIntersect.bind(null, range))
}

// adjust the start and end of a range to exclude ranges of a list
// does not split a range
// trimRange([[0, 5], [15, 20]], [0, 20]) => [5, 15]
// trimRange([[5, 15]], [0, 20]) => [0, 20]
export function trimRange (list, range) {
  let [start, end] = range
  sortRangesByStart(list).forEach((_range) => {
    if (rangeContainsPoint(_range, start)) {
      start = Math.min(_range[1], end)
    }
  })
  sortRangesByEnd(list).forEach((_range) => {
    if (rangeContainsPoint(_range, end - 1)) {
      end = Math.max(_range[0], start)
    }
  })
  return [start, end]
}

// find range - list
// subtractListFromRange([[5, 15]], [0, 20]) => [[0, 5], [15, 20]]
// subtractListFromRange([[0, 20]], [0, 20]) => []
export function subtractListFromRange (list, range) {
  return list.reduce((sublist, _range) => {
    return sublist
      .map((s) => {
        const a = subtractRange(s, _range)
        return a
      })
      .reduce(flatten, [])
  }, [range])
}

// find listA - listB
// returns a new list
export function subtractRangeList (listA, listB) {
  return listA
    .map((range) => subtractListFromRange(listB, range))
    .reduce(flatten, [])
}
