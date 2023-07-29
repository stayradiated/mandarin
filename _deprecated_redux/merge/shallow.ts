const shallowMerge = <Value>(
  newValue: Value,
  oldValue: Value | undefined,
): Value => {
  if (oldValue != null) {
    return { ...oldValue, ...newValue }
  }

  return newValue
}

export { shallowMerge }
