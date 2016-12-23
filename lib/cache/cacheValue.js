import assert from 'assert'

function cacheValue (action, getOptions) {
  assert(typeof action === 'function', 'action must be a function')
  assert(typeof getOptions === 'function', 'getOptions must be a function')

  return (...args) => {
    const options = getOptions(...args)

    const validate = options.validate || (() => true)
    const selectors = options.selectors

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
      return Promise.resolve(dispatch(action(...args)))
        .then(resolveWithGetState)
    }
  }
}

module.exports = cacheValue
