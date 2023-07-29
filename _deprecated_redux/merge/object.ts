import { shallowMerge } from './shallow.js'
import type { GetIdFn, UpdateFn } from './types.js'

type Options<Key, Value> = {
  getId: GetIdFn<Key, Value>
  updateFn?: UpdateFn<Value>
}

// Merge an object of values into the store
const createObjectMergeFunction = <Key, Value>(
  options: Options<Key, Value>,
) => {
  const { getId, updateFn = shallowMerge } = options

  return (
    values: Map<Key, Value>,
    object: Record<string, Value | undefined> | undefined,
  ) => {
    if (object == null) {
      return values
    }

    const valueMap = new Map(values)

    for (const key of Object.keys(object)) {
      const value = object[key]

      if (value != null) {
        const id = getId(value)
        valueMap.set(id, updateFn(value, valueMap.get(id)))
      }
    }

    return valueMap
  }
}

export { createObjectMergeFunction }
