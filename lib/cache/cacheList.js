import assert from 'assert'

import {
  filterListByRangeIntersect,
  subtractListFromRange,
  subtractRangeList,
} from '../utils/list'

const DEFAULT_VALIDATION = (values) => values.every((value) => value != null)

export default function cacheList (getOptions) {
  assert(
    typeof getOptions === 'function',
    'cacheList arg "getOptions" must be a function')

  return (...args) => {
    const options = getOptions(...args)

    const range = options.range
    assert(
      range != null,
      'cacheList option "range" must not be null')

    const dispatchFn = options.dispatch
    assert(
      typeof dispatchFn === 'function',
      'cacheList option "dispatch" must be a function')

    const validate = options.validate || DEFAULT_VALIDATION
    assert(
      typeof validate === 'function',
      'cacheList option "validate" must be a function')

    const selectors = options.selectors
    assert(
      typeof selectors === 'object',
      'cacheList option "selectors" must be a object')

    const getPromises = selectors.promises
    assert(
      typeof getPromises === 'function',
      'cacheList option "selectors.promises" must be a function')

    const getValues = selectors.values
    assert(
      typeof getValues === 'function',
      'cacheList option "selectors.values" must be a function')

    const getFetched = selectors.fetched == null ? getValues : selectors.fetched
    assert(
      typeof getFetched === 'function',
      'cacheList option "selectors.fetched" must be a function')

    return (dispatch, getState) => {
      const state = getState()
      const resolveWithGetState = () => Promise.resolve(getState)

      // find all they promises that make up this range and wait for them
      const promises = getPromises(state)
      const promised = filterListByRangeIntersect([...promises.keys()], range)
      const promise = Promise.all(promised.map(promises.get.bind(promises)))

      const unpromised = subtractListFromRange(promised, range)
      if (unpromised.length === 0) {
        return promise.then(resolveWithGetState)
      }

      const fetched = getFetched(state)
      const unfetched = subtractRangeList(unpromised, [...fetched.keys()])
      if (unfetched.length === 0) {
        const values = getValues(state).slice(range[0], range[1])

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
