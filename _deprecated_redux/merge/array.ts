import { shallowMerge } from './shallow.js'
import type { GetIdFn, UpdateFn } from './types.js'

type Options<Key, Value> = {
  getId: GetIdFn<Key, Value>
  updateFn?: UpdateFn<Value>
}

// Merge an array of a values into the store
const createArrayMergeFunction = <Key, Value>(options: Options<Key, Value>) => {
  const { getId, updateFn = shallowMerge } = options

  return (values: Map<Key, Value>, array: Value[] | undefined) => {
    if (array == null) {
      return values
    }

    const valueMap = new Map(values)

    for (const value of array) {
      if (value != null) {
        const id = getId(value)
        valueMap.set(id, updateFn(value, valueMap.get(id)))
      }
    }

    return valueMap
  }
}

export { createArrayMergeFunction }
