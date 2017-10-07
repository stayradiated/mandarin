import test from 'ava'
import sinon from 'sinon'
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
  const action = cacheList(() => ({
    range: [0, 1],
    dispatch: myAction,
  }))
  t.is(typeof action, 'function')
})

test('should dispatch the action', (t) => {
  const {dispatch, getState} = t.context

  const dispatchFn = sinon.spy(myAction)

  const action = cacheList(() => ({
    range: [0, 1],
    dispatch: dispatchFn,
    selectors: {
      promises: () => new PirateMap(),
      fetched: () => new PirateMap(),
      values: () => [],
    },
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.true(dispatchFn.calledOnce)
    t.deepEqual(dispatchFn.args, [
      [[0, 1]],
    ])
    t.true(dispatch.calledOnce)
    t.deepEqual(dispatch.args, [
      [{
        type: ACTION_TYPE,
      }],
    ])
  })
})

test('should return a promise if the value is being fetched', (t) => {
  const {dispatch, getState} = t.context

  const action = cacheList(() => ({
    range: [0, 1],
    dispatch: myAction,
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

  const action = cacheList(() => ({
    range: [0, 1],
    dispatch: myAction,
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

test('should return a promise if the value is being fetched in parts', (t) => {
  const {dispatch, getState} = t.context

  const action = cacheList(() => ({
    range: [10, 20],
    dispatch: myAction,
    selectors: {
      promises: () => new PirateMap([
        [[5, 15], PROMISE],
        [[15, 25], PROMISE],
      ]),
      fetched: () => new PirateMap(),
      values: () => [],
    },
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.false(dispatch.called)
  })
})

test('should dispatch the action with a trimmed range', (t) => {
  const {dispatch, getState} = t.context

  const dispatchFn = sinon.spy(myAction)

  const action = cacheList(() => ({
    range: [0, 100],
    dispatch: dispatchFn,
    selectors: {
      promises: () => new PirateMap([
        [[80, 90], PROMISE],
        [[90, 100], PROMISE],
      ]),
      fetched: () => new PirateMap([
        [[0, 10], true],
        [[10, 20], true],
      ]),
      values: () => [/* just pretend that there are values here... */],
    },
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.true(dispatchFn.calledOnce)
    t.deepEqual(dispatchFn.args, [
      [[20, 80]],
    ])
    t.true(dispatch.calledOnce)
    t.deepEqual(dispatch.args, [
      [{
        type: ACTION_TYPE,
      }],
    ])
  })
})

test('should not dispatch the action when range = promises + fetched', (t) => {
  const {dispatch, getState} = t.context

  const action = cacheList(() => ({
    range: [0, 50],
    dispatch: myAction,
    selectors: {
      promises: () => new PirateMap([
        [[0, 10], PROMISE],
        [[40, 50], PROMISE],
        [[10, 20], PROMISE],
      ]),
      fetched: () => new PirateMap([
        [[30, 40], true],
        [[20, 30], true],
      ]),
      values: () => [/* just pretend that there are values here... */],
    },
  }))

  const result = action()(dispatch, getState)
  return result.then((_getState) => {
    t.is(_getState, getState)
    t.false(dispatch.called)
  })
})
