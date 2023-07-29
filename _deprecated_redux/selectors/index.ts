import { createSelector } from 'reselect'

function automate(keys: string[]) {
  return <State>(
    getState: () => State,
    options: Record<string, unknown> = {},
  ) => {
    const KEYS = keys.reduce<Record<string, string>>((object, key) => {
      object[key] = options[key] || key
      return object
    }, {})

    return keys.reduce((object, key) => {
      const KEY = KEYS[key]
      object[key] = createSelector(getState, (state) => state[KEY])
      return object
    }, {})
  }
}

export const createValueSelector = automate([
  'error',
  'fetched',
  'promise',
  'value',
])

export const createMapSelector = automate([
  'errors',
  'fetched',
  'promises',
  'values',
])

export const createListSelector = automate([
  'errors',
  'fetched',
  'promises',
  'total',
  'values',
])

export const createMapListSelector = automate([
  'errors',
  'fetched',
  'promises',
  'total',
  'values',
])

export function exportValue(selectors, key) {
  return createSelector(selectors.value, (root) => root[key])
}
