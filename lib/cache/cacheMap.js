import assert from 'assert'

const DEFAULT_VALIDATION = () => true

export default function cacheMap (getOptions) {
  assert(
    typeof getOptions === 'function',
    'cacheMap arg "getOptions" must be a function')

  return (...args) => {
    const options = getOptions(...args)

    const id = options.id
    assert(
      id != null,
      'cacheMap option "id" must not be null')

    const dispatchFn = options.dispatch
    assert(
      typeof dispatchFn === 'function',
      'cacheMap option "dispatch" must be a function')

    const validate = options.validate || DEFAULT_VALIDATION
    assert(
      typeof validate === 'function',
      'cacheMap option "validate" must be a function')

    const selectors = options.selectors
    assert(
      typeof selectors === 'object',
      'cacheMap option "selectors" must be a object')

    const getPromises = selectors.promises
    assert(
      typeof getPromises === 'function',
      'cacheMap option "selectors.promises" must be a function')

    const getValues = selectors.values
    assert(
      typeof getValues === 'function',
      'cacheMap option "selectors.values" must be a function')

    const getFetched = selectors.fetched == null ? getValues : selectors.fetched
    assert(
      typeof getFetched === 'function',
      'cacheMap option "selectors.fetched" must be a function')

    return (dispatch, getState) => {
      const state = getState()
      const resolveWithGetState = () => Promise.resolve(getState)

      // check if we currently requesting this value
      const promises = getPromises(state)
      if (promises.has(id)) {
        return promises.get(id).then(resolveWithGetState)
      }

      // check if we already have this value
      const fetched = getFetched(state).has(id)
      if (fetched) {
        const value = getValues(state).get(id)

        // make sure that the value is valid
        if (validate(value)) {
          return resolveWithGetState()
        }
      }

      // else dispatch the action
      return Promise.resolve(dispatch(dispatchFn(...args)))
        .then(resolveWithGetState)
    }
  }
}
