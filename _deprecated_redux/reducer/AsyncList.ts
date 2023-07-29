import { createPirateMap } from 'piratemap'

const updateValue = (newValue) => newValue

const pirateMapRange = createPirateMap<Range>((a, b) => {
  return a[0] === b[0] && a[1] === b[1]
})

export default class AsyncList {
  constructor(options) {
    Object.assign(
      this,
      {
        values: 'values',
        errors: 'errors',
        promises: 'promises',
        fetched: 'fetched',
        total: 'total',

        updateValue,
      },
      options,
    )
  }

  handleRequest(state, range, promise) {
    const promiseMap = state[this.promises]
    pirateMapRange.set(promiseMap, range, promise)

    return {
      ...state,
      [this.promises]: promiseMap,
    }
  }

  handleFailure(state, range, error) {
    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.delete(range)

    const errorMap = new PirateMap(state[this.errors])
    errorMap.set(range, error)

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap,
    }
  }

  handleSuccess(state, range, values, total) {
    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.delete(range)

    const errorMap = new PirateMap(state[this.errors])
    errorMap.delete(range)

    const fetchedMap = new PirateMap(state[this.fetched])
    fetchedMap.set(range, true)

    let valueList = [...state[this.values]]
    for (
      let i = 0, length = values.length, offset = range[0];
      i < length;
      i += 1
    ) {
      valueList[i + offset] = this.updateValue(values[i], valueList[i + offset])
    }

    valueList = valueList.concat(
      Array.from({ length: total - valueList.length }).fill(),
    )

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap,
      [this.fetched]: fetchedMap,
      [this.values]: valueList,
      [this.total]: total,
    }
  }
}
