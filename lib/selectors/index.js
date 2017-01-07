import {createSelector} from 'reselect'

function automate (keys) {
  return (getState, options = {}) => {
    const KEYS = keys.reduce((obj, key) => {
      obj[key] = options[key] || key
      return obj
    }, {})

    return keys.reduce((obj, key) => {
      const KEY = KEYS[key]
      obj[key] = createSelector(getState, (state) => state[KEY])
      return obj
    }, {})
  }
}

export const createValueSelector = automate([
  'error', 'fetched', 'promise', 'value',
])

export const createMapSelector = automate([
  'errors', 'fetched', 'promises', 'values',
])

export const createListSelector = automate([
  'errors', 'fetched', 'promises', 'total', 'values',
])

export const createMapListSelector = automate([
  'errors', 'fetched', 'promises', 'total', 'values',
])

export function exportValue (selectors, key) {
  return createSelector(selectors.value, (root) => root[key])
}
