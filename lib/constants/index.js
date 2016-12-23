export default function newActionType (string) {
  if (Array.isArray(string)) {
    string = string[0]
  }

  const types = [
    `${string}_REQUEST`,
    `${string}_FAILURE`,
    `${string}_SUCCESS`,
  ]

  types.REQUEST = types[0]
  types.FAILURE = types[1]
  types.SUCCESS = types[2]

  return types
}
