/*

keys are range [start, end]
end is not inclusive
similar to Array.prototype.slice args

we need a data type that is like a Map() but can handle
arrays as keys

map = new PirateMap([
  [1, 2]: value,
])

listReducer: {
  promises: {
    [3, 5]: promise,
    [8, 10]: promise,
  },
  fetched: {
    [0, 3],
    [5, 8],
  },
  errors: {
    [0, 200]: Error('Cannot request more than 50 items'),
  },
  value: [0, 1, 2, null, null, 5, 6, 7, null, null],
  total: 10,
}
*/

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

// check if the keys of a map cover a range
export function mapContainsRange (map, range) {
  return listContainsRange(map.keys(), range)
}

// get the keys of a map that are part of a range
export function mapKeysThatIntersectRange (map, range) {
  return [...map.keys()].filter(rangesIntersect.bind(null, range))
}

export function trimRange (list, range) {
  let [start, end] = range
  sortRangesByStart(list).forEach((_range) => {
    if (rangeContainsPoint(_range, start)) {
      start = _range[1]
    }
  })
  sortRangesByEnd(list).forEach((_range) => {
    if (rangeContainsPoint(_range, end - 1)) {
      end = _range[0]
    }
  })
  return [start, end]
}
