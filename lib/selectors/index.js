import {createSelector} from 'reselect'

export {default as createValueSelector} from './createValueSelector'
export {default as createMapSelector} from './createMapSelector'

export function exportValue (selectors, key) {
  return createSelector(selectors.value, (root) => root[key])
}
