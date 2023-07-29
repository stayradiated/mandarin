import { shallowMerge } from './shallow.js'
import type { GetIdFn, UpdateFn } from './types.js'

type Options<Key, Value> = {
  getId: GetIdFn<Key, Value>
  updateFn?: UpdateFn<Value>
}

// Merge a single value into the store
const createValueMergeFunction = <Key, Value>(options: Options<Key, Value>) => {
  const { getId, updateFn = shallowMerge } = options

  return (
    values: Map<Key, Value>,
    value: Value | undefined,
  ): Map<Key, Value> => {
    if (value == null) {
      return values
    }

    const valueMap = new Map(values)

    const id = getId(value)
    valueMap.set(id, updateFn(value, valueMap.get(id)))

    return valueMap
  }
}

export { createValueMergeFunction }
