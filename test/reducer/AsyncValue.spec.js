import test from 'ava'

import AsyncValue from '../../lib/reducer/AsyncValue'

const PROMISE = 'PROMISE'
const ERROR = 'ERROR'
const VALUE = 'VALUE'

test('should set default options', (t) => {
  const asyncValue = new AsyncValue()
  t.is(asyncValue.value, 'value')
  t.is(asyncValue.promise, 'promise')
  t.is(asyncValue.fetched, 'fetched')
})

test('should override options', (t) => {
  const asyncValue = new AsyncValue({
    value: 'config',
  })

  t.is(asyncValue.value, 'config')
  t.is(asyncValue.promise, 'promise')
  t.is(asyncValue.fetched, 'fetched')
})

test('should set fetched to false', (t) => {
  const asyncValue = new AsyncValue()
  const state = {}

  const nextState = asyncValue.handleRequest(state, null)
  t.is(nextState.fetched, false)
})

test('should store promise', (t) => {
  const asyncValue = new AsyncValue()
  const state = {}

  const nextState = asyncValue.handleRequest(state, PROMISE)
  t.is(nextState.promise, PROMISE)
})

test('should reset promise', (t) => {
  const asyncValue = new AsyncValue()
  const state = {}

  const nextState = asyncValue.handleFailure(state, ERROR)
  t.is(nextState.promise, undefined)
})

test('should reset promise', (t) => {
  const asyncValue = new AsyncValue()
  const state = {}

  const nextState = asyncValue.handleSuccess(state, VALUE)
  t.is(nextState.promise, undefined)
})

test('should set fetched', (t) => {
  const asyncValue = new AsyncValue()
  const state = {}

  const nextState = asyncValue.handleSuccess(state, VALUE)
  t.is(nextState.fetched, true)
})

test('should set value', (t) => {
  const asyncValue = new AsyncValue()
  const state = {}

  const nextState = asyncValue.handleSuccess(state, VALUE)
  t.is(nextState.value, VALUE)
})
