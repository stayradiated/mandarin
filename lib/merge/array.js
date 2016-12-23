import shallowMerge from './shallow'

// merge an array of a values into the store
export default function createArrayMergeFunction (options) {
  const {getId, updateFn = shallowMerge} = options

  return (values, array) => {
    if (array == null) {
      return values
    }

    const valueMap = new Map(values)

    array.forEach((value) => {
      if (value != null) {
        const id = getId(value)
        valueMap.set(id, updateFn(value, valueMap.get(id)))
      }
    })

    return valueMap
  }
}
