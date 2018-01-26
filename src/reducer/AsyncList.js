import PirateMap from 'piratemap'

const updateValue = (newValue) => newValue

export default class AsyncList {
  constructor (options) {
    Object.assign(this, {
      values: 'values',
      errors: 'errors',
      promises: 'promises',
      fetched: 'fetched',
      total: 'total',

      updateValue
    }, options)
  }

  handleRequest (state, range, promise) {
    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.set(range, promise)

    return {
      ...state,
      [this.promises]: promiseMap
    }
  }

  handleFailure (state, range, error) {
    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.delete(range)

    const errorMap = new PirateMap(state[this.errors])
    errorMap.set(range, error)

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap
    }
  }

  handleSuccess (state, range, values, total) {
    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.delete(range)

    const errorMap = new PirateMap(state[this.errors])
    errorMap.delete(range)

    const fetchedMap = new PirateMap(state[this.fetched])
    fetchedMap.set(range, true)

    let valueList = [...state[this.values]]
    for (let i = 0, len = values.length, offset = range[0]; i < len; i += 1) {
      valueList[i + offset] = this.updateValue(values[i], valueList[i + offset])
    }
    valueList = valueList.concat(new Array(total - valueList.length).fill())

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap,
      [this.fetched]: fetchedMap,
      [this.values]: valueList,
      [this.total]: total
    }
  }
}
