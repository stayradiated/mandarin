import test from 'ava'
import sinon from 'sinon'
import 'sinon-as-promised'
import PirateMap from 'piratemap'

import cacheList from '../../lib/cache/cacheList'

const ACTION_TYPE = 'ACTION_TYPE'
const STATE = 'STATE'
const DISPATCH_RESULT = 'DISPATCH_RESULT'
const PROMISE = Promise.resolve('PROMISE')
const VALUE = 'VALUE'

function myAction () {
  return {
    type: ACTION_TYPE,
  }
}

test.beforeEach((t) => {
  t.context.dispatch = sinon.stub().resolves(DISPATCH_RESULT)
  t.context.getState = sinon.stub().returns(STATE)
})

test('should create an action', (t) => {
  const action = cacheList(myAction, () => ({range: [0, 1]}))
  t.is(typeof action, 'function')
})

test('should dispatch the action', (t) => {
  const {dispatch, getState} = t.context

  const action = cacheList(myAction, () => ({
    range: [0, 1],
    selectors: {
      promises: () => new PirateMap(),
      fetched: () => new PirateMap(),
      values: () => [],
    },
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.true(dispatch.calledOnce)
    t.deepEqual(dispatch.args, [
      [{
        type: ACTION_TYPE,
      }],
    ])
  })
})

test('should return a promise if the value is being fetcched', (t) => {
  const {dispatch, getState} = t.context

  const action = cacheList(myAction, () => ({
    range: [0, 1],
    selectors: {
      promises: () => new PirateMap([[[0, 1], PROMISE]]),
      fetched: () => new PirateMap([[[0, 1], true]]),
      values: () => [VALUE],
    },
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.false(dispatch.called)
  })
})

test('should return a promise if the value has been fetched', (t) => {
  const {dispatch, getState} = t.context

  const action = cacheList(myAction, () => ({
    range: [0, 1],
    selectors: {
      promises: () => new PirateMap(),
      fetched: () => new PirateMap([[[0, 1], true]]),
      values: () => [VALUE],
    },
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.false(dispatch.called)
  })
})
