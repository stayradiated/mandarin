import assert from 'node:assert'
import {
  filterListByRangeIntersect,
  subtractListFromRange,
  subtractRangeList,
} from '../utils/list'

const DEFAULT_VALIDATION = (values) => values.every((value) => value != null)

function getRangesFromMapKeys(map, id) {
  return [...map.keys()]
    .filter((key) => key[0] === id)
    .map((key) => [key[1], key[2]])
}

const cacheMapList = (getOptions) => {
  assert(
    typeof getOptions === 'function',
    'cacheMapList arg "getOptions" must be a function',
  )

  return (...args) => {
    const options = getOptions(...args)

    const {
      id,
      range,
      dispatch: dispatchFn,
      validate = DEFAULT_VALIDATION,
      selectors,
    } = options

    assert(id != null, 'cacheMapList option "id" must not be null')

    assert(range != null, 'cacheMapList option "range" must not be null')

    assert(
      typeof dispatchFn === 'function',
      'cacheMapList option "dispatch" must be a function',
    )

    assert(
      typeof validate === 'function',
      'cacheMapList option "validate" must be a function',
    )

    assert(
      typeof selectors === 'object',
      'cacheMapList option "selectors" must be a object',
    )

    const {
      promises: getPromises,
      values: getValues,
      fetched: getFetched = getValues,
    } = selectors

    assert(
      typeof getPromises === 'function',
      'cacheMapList option "selectors.promises" must be a function',
    )

    assert(
      typeof getValues === 'function',
      'cacheMapList option "selectors.values" must be a function',
    )

    assert(
      typeof getFetched === 'function',
      'cacheMapList option "selectors.fetched" must be a function',
    )

    return async (dispatch, getState) => {
      const state = getState()
      const resolveWithGetState = async () => getState

      // Find all they promises that make up this range and wait for them
      const promises = getPromises(state)
      const promiseKeys = getRangesFromMapKeys(promises, id)
      const promised = filterListByRangeIntersect(promiseKeys, range)
      const promise = Promise.all(
        promised.map((r) => {
          return promises.get([id, ...r])
        }),
      )

      const unpromised = subtractListFromRange(promised, range)
      if (unpromised.length === 0) {
        return promise.then(resolveWithGetState)
      }

      const fetched = getFetched(state)
      const fetchedKeys = getRangesFromMapKeys(fetched, id)
      const unfetched = subtractRangeList(unpromised, fetchedKeys)
      if (unfetched.length === 0) {
        const values = getValues(state).get(id).slice(range[0], range[1])

        // Make sure that the value is valid
        if (validate(values)) {
          return resolveWithGetState()
        }
      }

      // Else dispatch the action
      return Promise.all([
        promise,
        ...unfetched.map((trimmedRange) => dispatch(dispatchFn(trimmedRange))),
      ]).then(resolveWithGetState)
    }
  }
}

export { cacheMapList }
