import {createSelector} from 'reselect'

export {default as createListSelector} from './createListSelector'
export {default as createMapSelector} from './createMapSelector'
export {default as createValueSelector} from './createValueSelector'

export function exportValue (selectors, key) {
  return createSelector(selectors.value, (root) => root[key])
}
