import test from 'ava'
import sinon from 'sinon'

import cacheMap from './cacheMap'

const ACTION_TYPE = 'ACTION_TYPE'
const STATE = 'STATE'
const DISPATCH_RESULT = 'DISPATCH_RESULT'
const PROMISE = Promise.resolve('PROMISE')
const VALUE = 'VALUE'

function myAction () {
  return {
    type: ACTION_TYPE
  }
}

test.beforeEach((t) => {
  t.context.dispatch = sinon.stub().resolves(DISPATCH_RESULT)
  t.context.getState = sinon.stub().returns(STATE)
})

test('should create an action', (t) => {
  const action = cacheMap(() => ({ id: 1, dispatch: myAction }))
  t.is(typeof action, 'function')
})

test('should dispatch the action', (t) => {
  const { dispatch, getState } = t.context

  const action = cacheMap(() => ({
    id: 1,
    dispatch: myAction,
    selectors: {
      promises: () => new Map(),
      fetched: () => new Map(),
      values: () => new Map()
    }
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.true(dispatch.calledOnce)
    t.deepEqual(dispatch.args, [
      [{
        type: ACTION_TYPE
      }]
    ])
  })
})

test('should return a promise if the value is being fetched', (t) => {
  const { dispatch, getState } = t.context

  const action = cacheMap(() => ({
    id: 1,
    dispatch: myAction,
    selectors: {
      promises: () => new Map([[1, PROMISE]]),
      fetched: () => new Map([[1, true]]),
      values: () => new Map([[1, VALUE]])
    }
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.false(dispatch.called)
  })
})

test('should return a promise if the value has been fetched', (t) => {
  const { dispatch, getState } = t.context

  const action = cacheMap(() => ({
    id: 1,
    dispatch: myAction,
    selectors: {
      promises: () => new Map(),
      fetched: () => new Map([[1, true]]),
      values: () => new Map([[1, VALUE]])
    }
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.false(dispatch.called)
  })
})
