import AsyncValue from './AsyncValue'

const getPromise = (action) => action.promise
const getError = (action) => action.error
const getValue = (action) => action.value

export default class AsyncValueReducer extends AsyncValue {
  constructor (options) {
    super(options)

    Object.assign(this, {
      defaultValue: undefined,
      getPromise,
      getError,
      getValue,
    }, options)

    this.initialState = {
      [this.value]: this.defaultValue,
      [this.promise]: null,
      [this.error]: null,
      [this.fetched]: false,
    }
  }

  handleRequest (state, action) {
    const promise = this.getPromise(action)
    return super.handleRequest(state, promise)
  }

  handleFailure (state, action) {
    const error = this.getError(action)
    return super.handleFailure(state, error)
  }

  handleSuccess (state, action) {
    const value = this.getValue(action)
    return super.handleSuccess(state, value)
  }
}
