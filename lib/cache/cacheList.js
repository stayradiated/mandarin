import assert from 'assert'

import {mapContainsRange, mapKeysThatIntersectRange} from '../utils/list'

export default function cacheList (action, getOptions) {
  assert(
    typeof action === 'function',
    'cacheList arg "action" must be a function')

  assert(
    typeof getOptions === 'function',
    'cacheList arg "getOptions" must be a function')

  return (...args) => {
    const options = getOptions(...args)

    const range = options.range
    assert(range != null, 'could not get `range` from action options')

    const validate = options.validate || ((values) => values.every((value) => value != null))
    const selectors = options.selectors

    const getPromises = selectors.promises
    assert(
      typeof getPromises === 'function',
      'selectors.getPromises must be a function')

    const getValues = selectors.values
    assert(
      typeof getValues === 'function',
      'selectors.getValues must be a function')

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

      // else dispatch the action
      return Promise.resolve(dispatch(action(...args)))
        .then(resolveWithGetState)
    }
  }
}
