
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

export function clean (input) {
  return [...input]
    .sort((a, b) => a[0] - b[0])
    .reduce((acc, range, index, arr) => {
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

export function listContainsRange (list, range) {
  return clean(list).some((_range) => containsRange(_range, range))
}

export function mapContainsRange (map, range) {
  return listContainsRange(map.keys(), range)
}
