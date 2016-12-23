import test from 'ava'
import stu from 'stu'
import sinon from 'sinon'

test.beforeEach((t) => {
  stu((mock, require) => {
    t.context.AsyncMap = mock('../../lib/reducer/AsyncMap').default
    t.context.AsyncMapReducer = require('../../lib/reducer/AsyncMapReducer').default
  }).mock()
})

const STATE = 'STATE'
const ID = 'ID'
const PROMISE = 'PROMISE'
const ERROR = 'ERROR'
const VALUE = 'VALUE'
const OPTIONS = {
  values: 'values',
  errors: 'errors',
  promises: 'promises',
  fetched: 'fetched',
}

test('should create a new instance', (t) => {
  const {AsyncMap, AsyncMapReducer} = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

  t.is(AsyncMap.calledOnce, true)

  t.is(typeof reducer.getPromise, 'function')
  t.is(typeof reducer.getError, 'function')
  t.is(typeof reducer.getValue, 'function')

  t.deepEqual(reducer.initialState, {
    errors: {},
    values: {},
    promises: {},
    fetched: {},
  })
})

test('should bind request/failure/success methods', (t) => {
  const {AsyncMapReducer} = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

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
  const {AsyncMap, AsyncMapReducer} = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

  reducer.handleRequest(STATE, {
    payload: {id: ID},
    promise: PROMISE,
  })

  t.deepEqual(AsyncMap.prototype.handleRequest.args, [[
    STATE, ID, PROMISE,
  ]])
})

test('should get error', (t) => {
  const {AsyncMap, AsyncMapReducer} = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

  reducer.handleFailure(STATE, {
    payload: {id: ID},
    error: ERROR,
  })

  t.deepEqual(AsyncMap.prototype.handleFailure.args, [[
    STATE, ID, ERROR,
  ]])
})

test('should get value', (t) => {
  const {AsyncMap, AsyncMapReducer} = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

  reducer.handleSuccess(STATE, {
    payload: {id: ID},
    value: VALUE,
  })

  t.deepEqual(AsyncMap.prototype.handleSuccess.args, [[
    STATE, ID, VALUE,
  ]])
})
