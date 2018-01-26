const updateValue = (newValue) => newValue

export default class AsyncMap {
  constructor (options) {
    Object.assign(this, {
      values: 'values',
      errors: 'errors',
      promises: 'promises',
      fetched: 'fetched',

      updateValue
    }, options)
  }

  handleRequest (state, id, promise) {
    const promiseMap = new Map(state[this.promises])
    promiseMap.set(id, promise)

    return {
      ...state,
      [this.promises]: promiseMap
    }
  }

  handleFailure (state, id, error) {
    const promiseMap = new Map(state[this.promises])
    promiseMap.delete(id)

    const errorMap = new Map(state[this.errors])
    errorMap.set(id, error)

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap
    }
  }

  handleSuccess (state, id, value) {
    const promiseMap = new Map(state[this.promises])
    promiseMap.delete(id)

    const errorMap = new Map(state[this.errors])
    errorMap.delete(id)

    const fetchedMap = new Map(state[this.fetched])
    fetchedMap.set(id, true)

    const valueMap = new Map(state[this.values])
    valueMap.set(id, this.updateValue(value, valueMap.get(id)))

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap,
      [this.fetched]: fetchedMap,
      [this.values]: valueMap
    }
  }
}
