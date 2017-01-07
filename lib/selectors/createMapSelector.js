import {createSelector} from 'reselect'

export default function createMapSelector (getState, options = {}) {
  const ERRORS = options.errors || 'errors'
  const FETCHED = options.fetched || 'fetched'
  const PROMISES = options.promises || 'promises'
  const VALUES = options.values || 'values'

  return {
    errors: createSelector(getState, (state) => state[ERRORS]),
    fetched: createSelector(getState, (state) => state[FETCHED]),
    promises: createSelector(getState, (state) => state[PROMISES]),
    values: createSelector(getState, (state) => state[VALUES]),
  }
}
