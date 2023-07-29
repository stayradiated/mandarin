export default function reduxAsync() {
  return (next) => (action) => {
    // ignore the action if it doesn't have meta.async set
    if (!action.meta || !('async' in action.meta)) {
      return next(action)
    }

    if (!Array.isArray(action.types)) {
      throw new TypeError('action.types must be an array')
    }

    // Get the three action types
    const [REQUEST, FAILURE, SUCCESS] = action.types

    // Get the payload
    const { payload } = action

    // Do something async
    const promise = Promise.resolve(action.meta.async).then(
      (value) => {
        // Dispatch SUCCESS action
        next({
          type: SUCCESS,
          payload,
          promise,
          value,
        })
        return value
      },
      (error) => {
        // Dispatch FAILURE action
        next({
          type: FAILURE,
          payload,
          promise,
          error,
        })
        throw error
      },
    )

    // Dispatch REQUEST action
    next({
      type: REQUEST,
      payload,
      promise,
    })

    return promise
  }
}
