import PirateMap from 'piratemap'

const updateValue = (newValue) => newValue

export default class AsyncMapList {
  constructor (options) {
    Object.assign(this, {
      values: 'values',
      errors: 'errors',
      promises: 'promises',
      fetched: 'fetched',

      updateValue
    }, options)
  }

  handleRequest (state, id, range, promise) {
    const key = [id, ...range]

    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.set(key, promise)

    return {
      ...state,
      [this.promises]: promiseMap
    }
  }

  handleFailure (state, id, range, error) {
    const key = [id, ...range]

    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.delete(key)

    const errorMap = new PirateMap(state[this.errors])
    errorMap.set(key, error)

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap
    }
  }

  handleSuccess (state, id, range, values, total) {
    const key = [id, ...range]

    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.delete(key)

    const errorMap = new PirateMap(state[this.errors])
    errorMap.delete(key)

    const fetchedMap = new PirateMap(state[this.fetched])
    fetchedMap.set(key, true)

    const start = range[0]
    state = this.modifyItemValues(state, id, (valueList) => {
      for (let i = 0, len = values.length; i < len; i += 1) {
        valueList[i + start] = this.updateValue(values[i], valueList[i + start])
      }
      return valueList.concat(new Array(total - valueList.length).fill())
    })

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap,
      [this.fetched]: fetchedMap
    }
  }

  handleReset (state, id) {
    const fetchedMap = new PirateMap(state[this.fetched])
    fetchedMap.forEach((value, key) => {
      if (key[0] === id) {
        fetchedMap.delete(key)
      }
    })

    const valueMap = new Map(state[this.values])
    valueMap.delete(id)

    return {
      ...state,
      [this.fetched]: fetchedMap,
      [this.values]: valueMap
    }
  }

  modifyItemValues (state, id, updateFn) {
    const valueMap = new Map(state[this.values])
    const valueList = [...(valueMap.get(id) || [])]
    valueMap.set(id, updateFn(valueList, id))

    return {
      ...state,
      [this.values]: valueMap
    }
  }
}
