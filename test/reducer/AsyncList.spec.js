import test from 'ava'
import sinon from 'sinon'
import PirateMap from 'piratemap'

import AsyncList from '../../lib/reducer/AsyncList'

const RANGE = [0, 5]
const PROMISE = 'PROMISE'
const ERROR = 'ERROR'
const VALUE = ['a', 'b', 'c', 'd', 'e']

test.beforeEach((t) => {
  t.context.resolve = sinon.spy()
  t.context.reject = sinon.spy()

  t.context.requestState = {
    promises: new PirateMap(),
  }

  t.context.failureState = {
    promises: new PirateMap([[RANGE, t.context.reject]]),
  }

  t.context.successState = {
    promises: new PirateMap([[RANGE, t.context.resolve]]),
    error: new PirateMap([[RANGE, ERROR]]),
    values: [],
  }
})

test('should set default options', (t) => {
  const asyncList = new AsyncList()
  t.is(asyncList.values, 'values')
  t.is(asyncList.promises, 'promises')
})

test('should override options', (t) => {
  const asyncList = new AsyncList({
    values: 'values',
  })

  t.is(asyncList.promises, 'promises')
})

/*
 * REQUEST
 */

test('REQUEST - should store promise', (t) => {
  const {requestState} = t.context

  const asyncList = new AsyncList()
  const result = asyncList.handleRequest(requestState, RANGE, PROMISE)

  t.is(result.promises.get(RANGE), PROMISE)
})

/**
 * FAILURE
 */

test('FAILURE - should reset promise', (t) => {
  const {failureState} = t.context

  const asyncList = new AsyncList()
  const result = asyncList.handleFailure(failureState, RANGE, ERROR)

  t.is(result.promises.get(RANGE), undefined)
})

test('FAILURE - should set error', (t) => {
  const {failureState} = t.context

  const asyncList = new AsyncList()
  const result = asyncList.handleFailure(failureState, RANGE, ERROR)

  t.is(result.errors.get(RANGE), ERROR)
})

/**
 * SUCCESS
 */

test('SUCCESS - should reset promise', (t) => {
  const {successState} = t.context

  const asyncList = new AsyncList()
  const result = asyncList.handleSuccess(successState, RANGE, VALUE)

  t.is(result.promises.get(RANGE), undefined)
})

test('SUCCESS - should reset error', (t) => {
  const {successState} = t.context

  const asyncList = new AsyncList()
  const result = asyncList.handleSuccess(successState, RANGE, VALUE)

  t.is(result.errors.get(RANGE), undefined)
})

test('SUCCESS - should set fetched', (t) => {
  const {successState} = t.context

  const asyncList = new AsyncList()
  const result = asyncList.handleSuccess(successState, RANGE, VALUE)

  t.deepEqual(result.fetched.get(RANGE), true)
})

test('SUCCESS - should set value', (t) => {
  const {successState} = t.context

  const asyncList = new AsyncList()
  const result = asyncList.handleSuccess(successState, RANGE, VALUE)

  t.deepEqual(result.values, VALUE)
})

test('SUCCESS - should update value', (t) => {
  const {successState} = t.context
  successState.values = [-1, -2, -3, -4, -5]

  const asyncList = new AsyncList({
    updateValue: (newValue, oldValue) => newValue + oldValue,
  })
  const result = asyncList.handleSuccess(successState, [0, 5], [1, 2, 3, 4, 5])

  t.deepEqual(result.values, [0, 0, 0, 0, 0])
})

test('SUCCESS - should offset value', (t) => {
  const {successState} = t.context

  const asyncList = new AsyncList()
  const result = asyncList.handleSuccess(successState, [5, 10], [1, 2, 3, 4, 5])

  t.deepEqual(result.values, [
    undefined, undefined, undefined, undefined, undefined,
    1, 2, 3, 4, 5,
  ])
})
