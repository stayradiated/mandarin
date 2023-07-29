import {
  filterListByRangeIntersect,
  subtractListFromRange,
  subtractRangeList,
  type Range,
} from '../utils/list.js'

type Options<Value> = {
  range: Range
  fetch: (range: Range) => Promise<Value[]>
  validate?: (values: Array<Value | undefined>) => values is Value[]
  selectors: {
    promises: () => Map<Range, Promise<Value[]>>
    values: () => Value[]
    fetched: () => Map<Range, boolean>
  }
}

const defaultValidation = (values: unknown[]) =>
  values.every((value) => value != null)

const cacheList = async <Value>(options: Options<Value>) => {
  const {
    range,
    fetch: fetchFn,
    validate = defaultValidation,
    selectors,
  } = options

  const {
    promises: getPromises,
    values: getValues,
    fetched: getFetched,
  } = selectors

  // Find all they promises that make up this range and wait for them
  const promises = getPromises()
  const promisedRangeList = filterListByRangeIntersect(
    [...promises.keys()],
    range,
  )
  const promisedValues = promisedRangeList.map(async (key) => promises.get(key))
  const promise = Promise.all(promisedValues)

  const unpromisedRangeList = subtractListFromRange(promisedRangeList, range)
  if (unpromisedRangeList.length === 0) {
    return promise
  }

  const fetched = getFetched()
  const fetchedRangeList = [...fetched.keys()]
  const unfetchedRangeList = subtractRangeList(
    unpromisedRangeList,
    fetchedRangeList,
  )
  if (unfetchedRangeList.length === 0) {
    const values = getValues().slice(range[0], range[1])

    // Make sure that the value is valid
    if (validate(values)) {
      return values
    }
  }

  // Else dispatch the action
  return Promise.all([
    promise,
    ...unfetchedRangeList.map(async (trimmedRange) => fetchFn(trimmedRange)),
  ])
}

export { cacheList }
