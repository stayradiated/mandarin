import PirateMap from 'piratemap'
import AsyncMapList from './AsyncMapList'

const getId = (action) => action.payload.id
const getRange = (action) => [action.payload.start, action.payload.end]
const getPromise = (action) => action.promise
const getError = (action) => action.error

const getValues = (action) => action.value.items
const getTotal = (action) => action.value.total

export default class AsyncMapListReducer extends AsyncMapList {
  constructor(options) {
    super(options)

    Object.assign(
      this,
      {
        getId,
        getRange,
        getPromise,
        getError,
        getValues,
        getTotal,
      },
      options,
    )

    this.initialState = {
      [this.errors]: new PirateMap(),
      [this.fetched]: new PirateMap(),
      [this.promises]: new PirateMap(),
      [this.values]: new Map(),
    }
  }

  handleRequest(state, action) {
    const id = this.getId(action)
    const range = this.getRange(action)
    const promise = this.getPromise(action)
    return super.handleRequest(state, id, range, promise)
  }

  handleFailure(state, action) {
    const id = this.getId(action)
    const range = this.getRange(action)
    const error = this.getError(action)
    return super.handleFailure(state, id, range, error)
  }

  handleSuccess(state, action) {
    const id = this.getId(action)
    const range = this.getRange(action)
    const values = this.getValues(action)
    const total = this.getTotal(action)
    return super.handleSuccess(state, id, range, values, total)
  }

  handleReset(state, action) {
    const id = this.getId(action)
    return super.handleReset(state, id)
  }

  modifyItemValuesForAction(state, action, updateFn) {
    const id = this.getId(action)
    return super.modifyItemValues(state, id, updateFn)
  }
}
