import assert from 'assert'

import {
  mapContainsRange,
  mapKeysThatIntersectRange,
  trimRange,
} from '../utils/list'

const DEFAULT_VALIDATION = (values) => values.every((value) => value != null)

export default function cacheList (getOptions) {
  assert(typeof getOptions === 'function',
    'cacheList arg "getOptions" must be a function')

  return (...args) => {
    const options = getOptions(...args)

    const range = options.range
    assert(range != null,
      'could not get `range` from action options')

    const dispatchFn = options.dispatch
    assert(typeof dispatchFn === 'function',
      'cacheList option "dispatch" must be a function')

    const selectors = options.selectors
    assert(typeof selectors === 'object',
      'cacheList option "selectors" must be a object')

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

      // check if we are currently requesting this range
      const promises = getPromises(state)
      if (mapContainsRange(promises, range)) {
        // find all they promises that make up this range and wait for them
        const keys = mapKeysThatIntersectRange(promises, range)
        return Promise.all(keys.map(promises.get.bind(promises)))
          .then(resolveWithGetState)
      }

      // check if we already have this value
      const fetched = getFetched(state)
      if (mapContainsRange(fetched, range)) {
        const values = getValues(state).slice(range[0], range[1])

        // make sure that the value is valid
        if (validate(values)) {
          return resolveWithGetState()
        }
      }

      // trim the range so that we are not requesting the same items over and
      // over again
      const trimmedRange = trimRange(
        [...promises.keys()].concat([...fetched.keys()]),
        range,
      )

      // else dispatch the action
      return Promise.resolve(dispatch(dispatchFn(trimmedRange)))
        .then(resolveWithGetState)
    }
  }
}
