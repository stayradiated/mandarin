import shallowMerge from './shallow'

// merge an object of values into the store
export default function createObjectMergeFunction (options) {
  const { getId, updateFn = shallowMerge } = options

  return (values, object) => {
    if (object == null) {
      return values
    }

    const valueMap = new Map(values)

    Object.keys(object).forEach((key) => {
      const value = object[key]

      if (value != null) {
        const id = getId(value)
        valueMap.set(id, updateFn(value, valueMap.get(id)))
      }
    })

    return valueMap
  }
}
