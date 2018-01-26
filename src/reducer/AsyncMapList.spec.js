import test from 'ava'
import sinon from 'sinon'
import PirateMap from 'piratemap'

import AsyncMapList from './AsyncMapList'

const ID = 123
const RANGE = [0, 5]
const KEY = [123, ...RANGE]
const PROMISE = 'PROMISE'
const ERROR = 'ERROR'
const VALUES = ['a', 'b', 'c', 'd', 'e']
const TOTAL = 5

test.beforeEach((t) => {
  t.context.resolve = sinon.spy()
  t.context.reject = sinon.spy()

  t.context.requestState = {
    promises: new PirateMap()
  }

  t.context.failureState = {
    promises: new PirateMap([[KEY, t.context.reject]])
  }

  t.context.successState = {
    promises: new PirateMap([[KEY, t.context.resolve]]),
    error: new PirateMap([[KEY, ERROR]]),
    values: new Map()
  }

  t.context.resetState = {
    fetched: new PirateMap([[KEY, true]]),
    values: new Map([[ID, VALUES]])
  }
})

test('should set default options', (t) => {
  const asyncList = new AsyncMapList()
  t.is(asyncList.values, 'values')
  t.is(asyncList.promises, 'promises')
})

test('should override options', (t) => {
  const asyncList = new AsyncMapList({
    values: 'values'
  })

  t.is(asyncList.promises, 'promises')
})

/*
 * REQUEST
 */

test('REQUEST - should store promise', (t) => {
  const { requestState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleRequest(requestState, ID, RANGE, PROMISE)

  t.is(result.promises.get(KEY), PROMISE)
})

/**
 * FAILURE
 */

test('FAILURE - should reset promise', (t) => {
  const { failureState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleFailure(failureState, ID, RANGE, ERROR)

  t.is(result.promises.get(KEY), undefined)
})

test('FAILURE - should set error', (t) => {
  const { failureState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleFailure(failureState, ID, RANGE, ERROR)

  t.is(result.errors.get(KEY), ERROR)
})

/**
 * SUCCESS
 */

test('SUCCESS - should reset promise', (t) => {
  const { successState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleSuccess(successState, ID, RANGE, VALUES, TOTAL)

  t.is(result.promises.get(KEY), undefined)
})

test('SUCCESS - should reset error', (t) => {
  const { successState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleSuccess(successState, ID, RANGE, VALUES, TOTAL)

  t.is(result.errors.get(KEY), undefined)
})

test('SUCCESS - should set fetched', (t) => {
  const { successState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleSuccess(successState, ID, RANGE, VALUES, TOTAL)

  t.deepEqual(result.fetched.get(KEY), true)
})

test('SUCCESS - should set value', (t) => {
  const { successState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleSuccess(successState, ID, RANGE, VALUES, TOTAL)

  t.deepEqual(result.values, new Map([
    [ID, VALUES]
  ]))
})

test('SUCCESS - should update value', (t) => {
  const { successState } = t.context
  successState.values.set(20, [-1, -2, -3, -4, -5])

  const asyncList = new AsyncMapList({
    updateValue: (newValue, oldValue) => newValue + oldValue
  })
  const result = asyncList.handleSuccess(successState, 20, [0, 5], [1, 2, 3, 4, 5], 10)

  t.deepEqual(result.values, new Map([
    [20, [
      0, 0, 0, 0, 0,
      undefined, undefined, undefined, undefined, undefined
    ]]
  ]))
})

test('SUCCESS - should offset value', (t) => {
  const { successState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleSuccess(successState, 20, [5, 10], [1, 2, 3, 4, 5], 10)

  t.deepEqual(result.values, new Map([
    [20, [
      undefined, undefined, undefined, undefined, undefined,
      1, 2, 3, 4, 5
    ]]
  ]))
})

test('RESET - should reset value', (t) => {
  const { resetState } = t.context

  const asyncList = new AsyncMapList()
  const result = asyncList.handleReset(resetState, ID)

  t.deepEqual(result.values, new Map([]))
  t.deepEqual(result.fetched, new PirateMap([]))
})
