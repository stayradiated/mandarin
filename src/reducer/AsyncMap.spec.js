import test from 'ava'
import sinon from 'sinon'

import AsyncMap from './AsyncMap'

const ID = 'ID'
const PROMISE = 'PROMISE'
const ERROR = 'ERROR'
const VALUE = 'VALUE'

test.beforeEach((t) => {
  t.context.resolve = sinon.spy()
  t.context.reject = sinon.spy()

  t.context.requestState = {
    promises: new Map()
  }

  t.context.failureState = {
    promises: new Map([[ID, t.context.reject]])
  }

  t.context.successState = {
    promises: new Map([[ID, t.context.resolve]]),
    values: new Map()
  }
})

test('should set default options', (t) => {
  const asyncMap = new AsyncMap()
  t.is(asyncMap.values, 'values')
  t.is(asyncMap.promises, 'promises')
})

test('should override options', (t) => {
  const asyncMap = new AsyncMap({
    values: 'values'
  })

  t.is(asyncMap.promises, 'promises')
})

test('REQUEST - should store promise', (t) => {
  const { requestState } = t.context

  const asyncMap = new AsyncMap()
  const result = asyncMap.handleRequest(requestState, ID, PROMISE)

  t.is(result.promises.get(ID), PROMISE)
})

test('FAILURE - should reset promise', (t) => {
  const { failureState } = t.context

  const asyncMap = new AsyncMap()
  const result = asyncMap.handleFailure(failureState, ID, ERROR)

  t.is(result.promises.get(ID), undefined)
})

test('SUCCESS - should reset promise', (t) => {
  const { successState } = t.context

  const asyncMap = new AsyncMap()
  const result = asyncMap.handleSuccess(successState, ID, VALUE)

  t.is(result.promises.get(ID), undefined)
})

test('SUCCESS - should set value', (t) => {
  const { successState } = t.context

  const asyncMap = new AsyncMap()
  const result = asyncMap.handleSuccess(successState, ID, VALUE)

  t.is(result.values.get(ID), VALUE)
})
