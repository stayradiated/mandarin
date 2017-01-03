import PirateMap from 'piratemap'

import AsyncList from './AsyncList'

const getRange = (action) => [action.payload.start, action.payload.end]
const getPromise = (action) => action.promise
const getError = (action) => action.error

const getValues = (action) => action.value.items
const getTotal = (action) => action.value.total

export default class AsyncListReducer extends AsyncList {
  constructor (options) {
    super(options)

    Object.assign(this, {
      getRange,
      getPromise,
      getError,
      getValues,
      getTotal,
    }, options)

    this.initialState = {
      [this.errors]: new PirateMap(),
      [this.fetched]: new PirateMap(),
      [this.promises]: new PirateMap(),
      [this.values]: [],
      [this.total]: 0,
    }
  }

  handleRequest (state, action) {
    const range = this.getRange(action)
    const promise = this.getPromise(action)
    return super.handleRequest(state, range, promise)
  }

  handleFailure (state, action) {
    const range = this.getRange(action)
    const error = this.getError(action)
    return super.handleFailure(state, range, error)
  }

  handleSuccess (state, action) {
    const range = this.getRange(action)
    const values = this.getValues(action)
    const total = this.getTotal(action)
    return super.handleSuccess(state, range, values, total)
  }
}
