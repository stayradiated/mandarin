import test from 'ava'
import stu from 'stu'

test.beforeEach((t) => {
  stu((mock, require) => {
    t.context.AsyncMap = mock('./AsyncMap').default
    t.context.AsyncMapReducer = require('./AsyncMapReducer').default
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
  const { AsyncMap, AsyncMapReducer } = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

  t.is(AsyncMap.calledOnce, true)

  t.is(typeof reducer.getPromise, 'function')
  t.is(typeof reducer.getError, 'function')
  t.is(typeof reducer.getValue, 'function')

  t.deepEqual(reducer.initialState, {
    errors: new Map(),
    values: new Map(),
    promises: new Map(),
    fetched: new Map(),
  })
})

test('should get promise', (t) => {
  const { AsyncMap, AsyncMapReducer } = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

  reducer.handleRequest(STATE, {
    payload: { id: ID },
    promise: PROMISE,
  })

  t.deepEqual(AsyncMap.prototype.handleRequest.args, [[STATE, ID, PROMISE]])
})

test('should get error', (t) => {
  const { AsyncMap, AsyncMapReducer } = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

  reducer.handleFailure(STATE, {
    payload: { id: ID },
    error: ERROR,
  })

  t.deepEqual(AsyncMap.prototype.handleFailure.args, [[STATE, ID, ERROR]])
})

test('should get value', (t) => {
  const { AsyncMap, AsyncMapReducer } = t.context

  const reducer = new AsyncMapReducer(OPTIONS)

  reducer.handleSuccess(STATE, {
    payload: { id: ID },
    value: VALUE,
  })

  t.deepEqual(AsyncMap.prototype.handleSuccess.args, [[STATE, ID, VALUE]])
})
