import shallowMerge from './shallow'

// merge a single value into the store
export default function createValueMergeFunction (reducer) {
  const {getId, updateFn = shallowMerge} = reducer

  return (values, value) => {
    if (value == null) {
      return values
    }

    const valueMap = new Map(values)

    const id = getId(value)
    valueMap.set(id, updateFn(value, valueMap.get(id)))

    return valueMap
  }
}
