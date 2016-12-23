import test from 'ava'
import stu from 'stu'
import sinon from 'sinon'

test.beforeEach((t) => {
  stu((mock, require) => {
    t.context.AsyncValue = mock('../../lib/reducer/AsyncValue').default
    t.context.AsyncValueReducer = require('../../lib/reducer/AsyncValueReducer').default
  }).mock()
})

const STATE = 'STATE'
const PROMISE = 'PROMISE'
const ERROR = 'ERROR'
const VALUE = 'VALUE'
const OPTIONS = {
  value: 'value',
  error: 'error',
  promise: 'promise',
  fetched: 'fetched',
}

test('should create a new instance', (t) => {
  const {AsyncValue, AsyncValueReducer} = t.context
  const reducer = new AsyncValueReducer(OPTIONS)

  t.is(AsyncValue.calledOnce, true)

  t.is(reducer.defaultValue, undefined)
  t.is(typeof reducer.getPromise, 'function')
  t.is(typeof reducer.getError, 'function')
  t.is(typeof reducer.getValue, 'function')

  t.deepEqual(reducer.initialState, {
    error: null,
    promise: null,
    fetched: false,
    value: undefined,
  })
})

test('should bind request/failure/success methods', (t) => {
  const {AsyncValueReducer} = t.context

  const reducer = new AsyncValueReducer(OPTIONS)

  const types = [
    'request', 'failure', 'success',
  ]

  const handleRequest = sinon.stub(reducer, 'handleRequest')
  const handleFailure = sinon.stub(reducer, 'handleFailure')
  const handleSuccess = sinon.stub(reducer, 'handleSuccess')

  const handler = reducer.handle(types)

  t.is(typeof handler.request, 'function')
  t.is(typeof handler.failure, 'function')
  t.is(typeof handler.success, 'function')

  t.is(handleRequest.calledOnce, false)
  handler.request()
  t.is(handleRequest.calledOnce, true)

  t.is(handleFailure.calledOnce, false)
  handler.failure()
  t.is(handleFailure.calledOnce, true)

  t.is(handleSuccess.calledOnce, false)
  handler.success()
  t.is(handleSuccess.calledOnce, true)
})

test('should get promise', (t) => {
  const {AsyncValue, AsyncValueReducer} = t.context

  const reducer = new AsyncValueReducer(OPTIONS)

  reducer.handleRequest(STATE, {
    payload: {},
    promise: PROMISE,
  })

  t.deepEqual(AsyncValue.prototype.handleRequest.args, [[
    STATE, PROMISE,
  ]])
})

test('should get error', (t) => {
  const {AsyncValue, AsyncValueReducer} = t.context

  const reducer = new AsyncValueReducer(OPTIONS)

  reducer.handleFailure(STATE, {
    payload: {},
    error: ERROR,
  })

  t.deepEqual(AsyncValue.prototype.handleFailure.args, [[
    STATE, ERROR,
  ]])
})

test('should get value', (t) => {
  const {AsyncValue, AsyncValueReducer} = t.context

  const reducer = new AsyncValueReducer(OPTIONS)

  reducer.handleSuccess(STATE, {
    payload: {},
    value: VALUE,
  })

  t.deepEqual(AsyncValue.prototype.handleSuccess.args, [[
    STATE, VALUE,
  ]])
})
