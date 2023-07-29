const defaultValidation = () => true

type Options<Value> = {
  fetch: () => Promise<Value>
  validate?: (value: Value | undefined) => value is Value
  selectors: {
    promise: () => Promise<Value> | undefined
    value: () => Value | undefined
    fetched: () => boolean | undefined
  }
}

const cacheValue = async <Value>(options: Options<Value>): Promise<Value> => {
  const { fetch: fetchFn, validate = defaultValidation, selectors } = options

  const {
    promise: getPromise,
    value: getValue,
    fetched: getFetched,
  } = selectors

  // Check if we currently requesting this value
  const promise = getPromise()
  if (promise != null) {
    return promise
  }

  // Check if we already have this value
  const fetched = getFetched()
  if (fetched) {
    const value = getValue()

    // Make sure that the value is valid
    if (validate(value)) {
      return value
    }
  }

  // Else dispatch the action
  return fetchFn()
}

export { cacheValue }
