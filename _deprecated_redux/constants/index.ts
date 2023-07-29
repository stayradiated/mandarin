type ActionTypes = [string, string, string] & {
  REQUEST: string
  FAILURE: string
  SUCCESS: string
}

const newActionType = (input: string | TemplateStringsArray): ActionTypes => {
  const actionName = Array.isArray(input) ? input[0] : input

  const types = [
    `${actionName}_REQUEST`,
    `${actionName}_FAILURE`,
    `${actionName}_SUCCESS`,
  ] as ActionTypes

  types.REQUEST = types[0]
  types.FAILURE = types[1]
  types.SUCCESS = types[2]

  return types
}

export { newActionType }
