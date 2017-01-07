import assert from 'assert'

import {
  filterListByRangeIntersect,
  subtractListFromRange,
  subtractRangeList,
} from '../utils/list'

const DEFAULT_VALIDATION = (values) => values.every((value) => value != null)

function getRangesFromMapKeys (map, id) {
  return [...map.keys()]
    .filter((key) => key[0] === id)
    .map((key) => [key[1], key[2]])
}

export default function cacheMapList (getOptions) {
  assert(typeof getOptions === 'function',
    'cacheMapList arg "getOptions" must be a function')

  return (...args) => {
    const options = getOptions(...args)

    const id = options.id
    assert(id != null,
      'could not get `id` from action options')

    const range = options.range
    assert(range != null,
      'could not get `range` from action options')

    const dispatchFn = options.dispatch
    assert(typeof dispatchFn === 'function',
      'cacheMapList option "dispatch" must be a function')

    const selectors = options.selectors
    assert(typeof selectors === 'object',
      'cacheMapList option "selectors" must be a object')

    const getPromises = selectors.promises
    assert(
      typeof getPromises === 'function',
      'selectors.getPromises must be a function')

    const getValues = selectors.values
    assert(
      typeof getValues === 'function',
      'selectors.getValues must be a function')

    const validate = options.validate || DEFAULT_VALIDATION
    const getFetched = selectors.fetched == null ? getValues : selectors.fetched

    return (dispatch, getState) => {
      const state = getState()
      const resolveWithGetState = () => Promise.resolve(getState)

      // find all they promises that make up this range and wait for them
      const promises = getPromises(state)
      const promiseKeys = getRangesFromMapKeys(promises, id)
      const promised = filterListByRangeIntersect(promiseKeys, range)
      const promise = Promise.all(promised.map((r) => {
        return promises.get([id, ...r])
      }))

      const unpromised = subtractListFromRange(promised, range)
      if (unpromised.length === 0) {
        return promise.then(resolveWithGetState)
      }

      const fetched = getFetched(state)
      const fetchedKeys = getRangesFromMapKeys(fetched, id)
      const unfetched = subtractRangeList(unpromised, fetchedKeys)
      if (unfetched.length === 0) {
        const values = getValues(state).get(id).slice(range[0], range[1])

        // make sure that the value is valid
        if (validate(values)) {
          return resolveWithGetState()
        }
      }

      // else dispatch the action
      return Promise.all([
        promise,
        ...unfetched.map((trimmedRange) => dispatch(dispatchFn(trimmedRange))),
      ])
        .then(resolveWithGetState)
    }
  }
}
