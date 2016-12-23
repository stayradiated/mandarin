export default function reduxAsync () {
  return (next) => (action) => {
    // ignore the action if it doesn't have meta.async set
    if (!action.meta || !('async' in action.meta)) {
      return next(action)
    }

    if (Array.isArray(action.types) === false) {
      throw new Error('action.types must be an array')
    }

    // get the three action types
    const [REQUEST, FAILURE, SUCCESS] = action.types

    // get the payload
    const {payload} = action

    // do something async
    const promise = Promise.resolve(action.meta.async)
      .then((value) => {
        // dispatch SUCCESS action
        next({
          type: SUCCESS,
          payload,
          promise,
          value,
        })
        return value
      })
      .catch((error) => {
        // dispatch FAILURE action
        next({
          type: FAILURE,
          payload,
          promise,
          error,
        })
        throw error
      })

    // dispatch REQUEST action
    next({
      type: REQUEST,
      payload,
      promise,
    })

    return promise
  }
}
