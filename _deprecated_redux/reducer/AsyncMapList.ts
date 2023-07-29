import PirateMap from 'piratemap'

type UpdateValueFn<Value> = (newValue: Value) => Value

const defaultUpdateValue: UpdateValueFn<any> = (newValue) => newValue

type State = Record<string, unknown>
type Id = string
type Range = [number, number]
type Value = unknown

type AsyncMapListConstructorOptions<T> = {
  values?: string
  errors?: string
  promises?: string
  fetched?: string
  updateValue?: UpdateValueFn<T>
}

export default class AsyncMapList<T = unknown> {
  values: string
  errors: string
  promises: string
  fetched: string
  updateValue: UpdateValueFn<T>

  constructor(options: AsyncMapListConstructorOptions<T> = {}) {
    this.values = options.values ?? 'values'
    this.errors = options.errors ?? 'errors'
    this.promises = options.promises ?? 'promises'
    this.fetched = options.fetched ?? 'fetched'
    this.updateValue = options.updateValue ?? defaultUpdateValue
  }

  handleRequest(state: State, id: Id, range: Range, promise: Promise<unknown>) {
    const key = [id, ...range]

    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.set(key, promise)

    return {
      ...state,
      [this.promises]: promiseMap,
    }
  }

  handleFailure(state: State, id: Id, range: Range, error: Error) {
    const key = [id, ...range]

    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.delete(key)

    const errorMap = new PirateMap(state[this.errors])
    errorMap.set(key, error)

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap,
    }
  }

  handleSuccess(
    state: State,
    id: Id,
    range: Range,
    values: Value[],
    total: number,
  ) {
    const key = [id, ...range]

    const promiseMap = new PirateMap(state[this.promises])
    promiseMap.delete(key)

    const errorMap = new PirateMap(state[this.errors])
    errorMap.delete(key)

    const fetchedMap = new PirateMap(state[this.fetched])
    fetchedMap.set(key, true)

    const start = range[0]
    state = this.modifyItemValues(state, id, (valueList) => {
      for (let i = 0, length = values.length; i < length; i += 1) {
        valueList[i + start] = this.updateValue(values[i], valueList[i + start])
      }

      return valueList.concat(
        Array.from({ length: total - valueList.length }).fill(),
      )
    })

    return {
      ...state,
      [this.promises]: promiseMap,
      [this.errors]: errorMap,
      [this.fetched]: fetchedMap,
    }
  }

  handleReset(state: State, id: Id) {
    const fetchedMap = new PirateMap(state[this.fetched])
    for (const [key, value] of fetchedMap.entries()) {
      if (key[0] === id) {
        fetchedMap.delete(key)
      }
    }

    const valueMap = new Map(state[this.values])
    valueMap.delete(id)

    return {
      ...state,
      [this.fetched]: fetchedMap,
      [this.values]: valueMap,
    }
  }

  modifyItemValues(
    state: State,
    id: Id,
    updateFn: (valueList: Value[]) => Value[],
  ) {
    const valueMap = new Map(state[this.values])
    const valueList = [...(valueMap.get(id) || [])]
    valueMap.set(id, updateFn(valueList, id))

    return {
      ...state,
      [this.values]: valueMap,
    }
  }
}
