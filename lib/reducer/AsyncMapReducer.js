import AsyncMap from './AsyncMap'

const getId = (action) => action.payload.id
const getPromise = (action) => action.promise
const getError = (action) => action.error
const getValue = (action) => action.value

export default class AsyncMapReducer extends AsyncMap {
  constructor (options) {
    super(options)

    Object.assign(this, {
      getId,
      getPromise,
      getError,
      getValue,
    }, options)

    this.initialState = {
      [this.values]: {},
      [this.errors]: {},
      [this.promises]: {},
      [this.fetched]: {},
    }
  }

  handle (types) {
    return {
      [types[0]]: this.handleRequest.bind(this),
      [types[1]]: this.handleFailure.bind(this),
      [types[2]]: this.handleSuccess.bind(this),
    }
  }

  handleRequest (state, action) {
    const id = this.getId(action)
    const promise = this.getPromise(action)
    return super.handleRequest(state, id, promise)
  }

  handleFailure (state, action) {
    const id = this.getId(action)
    const error = this.getError(action)
    return super.handleFailure(state, id, error)
  }

  handleSuccess (state, action) {
    const id = this.getId(action)
    const value = this.getValue(action)
    return super.handleSuccess(state, id, value)
  }
}
