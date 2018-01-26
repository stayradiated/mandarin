export default function shallowMerge (newValue, oldValue) {
  if (oldValue != null) {
    return { ...oldValue, ...newValue }
  }
  return newValue
}
