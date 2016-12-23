import {createSelector} from 'reselect'

export default function createMapSelector (getState, options) {
  const VALUES = options.values || 'values'
  const ERRORS = options.errors || 'errors'
  const PROMISES = options.promises || 'promises'
  const FETCHED = options.fetched || 'fetched'

  return {
    values: createSelector(getState, (state) => state[VALUES]),
    errors: createSelector(getState, (state) => state[ERRORS]),
    promises: createSelector(getState, (state) => state[PROMISES]),
    fetched: createSelector(getState, (state) => state[FETCHED]),
  }
}
