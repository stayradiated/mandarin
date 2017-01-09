import assert from 'assert'

const DEFAULT_VALIDATION = () => true

export default function cacheValue (getOptions) {
  assert(
    typeof getOptions === 'function',
    'cacheValue arg "getOptions" must be a function')

  return (...args) => {
    const options = getOptions(...args)

    const dispatchFn = options.dispatch
    assert(
      typeof dispatchFn === 'function',
      'cacheValue option "dispatch" must be a function')

    const validate = options.validate || DEFAULT_VALIDATION
    assert(
      typeof validate === 'function',
      'cacheValue option "validate" must be a function')

    const selectors = options.selectors
    assert(typeof selectors === 'object',
      'cacheValue option "selectors" must be a object')

    const getPromise = selectors.promise
    assert(
      typeof getPromise === 'function',
      'selectors.getPromise must be a function')

    const getValue = selectors.value
    assert(
      typeof getValue === 'function',
      'selectors.getValue must be a function')

    const getFetched = selectors.fetched
    assert(
      typeof getFetched === 'function',
      'selectors.getFetched must be a function')

    return (dispatch, getState) => {
      const state = getState()
      const resolveWithGetState = () => Promise.resolve(getState)

      // check if we currently requesting this value
      const promise = getPromise(state)
      if (promise != null) {
        return promise.then(resolveWithGetState)
      }

      // check if we already have this value
      const fetched = getFetched(state)
      if (fetched) {
        const value = getValue(state)

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
