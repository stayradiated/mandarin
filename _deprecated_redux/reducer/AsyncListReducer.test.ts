import test from 'ava'
import stu from 'stu'
import PirateMap from 'piratemap'

test.beforeEach((t) => {
  stu((mock, require) => {
    t.context.AsyncList = mock('./AsyncList').default
    t.context.AsyncListReducer = require('./AsyncListReducer').default
  }).mock()
})

const STATE = 'STATE'
const START = 0
const END = 5
const RANGE = [START, END]
const PROMISE = 'PROMISE'
const ERROR = 'ERROR'
const VALUES = ['V', 'A', 'L', 'U', 'E']
const TOTAL = 5
const OPTIONS = {
  errors: 'errors',
  fetched: 'fetched',
  promises: 'promises',
  total: 'total',
  values: 'values',
}

test('should create a new instance', (t) => {
  const { AsyncList, AsyncListReducer } = t.context

  const reducer = new AsyncListReducer(OPTIONS)

  t.is(AsyncList.calledOnce, true)

  t.is(typeof reducer.getPromise, 'function')
  t.is(typeof reducer.getError, 'function')
  t.is(typeof reducer.getValues, 'function')

  t.deepEqual(reducer.initialState, {
    errors: new PirateMap(),
    fetched: new PirateMap(),
    promises: new PirateMap(),
    values: [],
    total: 0,
  })
})

test('should get promise', (t) => {
  const { AsyncList, AsyncListReducer } = t.context

  const reducer = new AsyncListReducer(OPTIONS)

  reducer.handleRequest(STATE, {
    payload: { start: START, end: END },
    promise: PROMISE,
  })

  t.deepEqual(AsyncList.prototype.handleRequest.args, [[STATE, RANGE, PROMISE]])
})

test('should get error', (t) => {
  const { AsyncList, AsyncListReducer } = t.context

  const reducer = new AsyncListReducer(OPTIONS)

  reducer.handleFailure(STATE, {
    payload: { start: START, end: END },
    error: ERROR,
  })

  t.deepEqual(AsyncList.prototype.handleFailure.args, [[STATE, RANGE, ERROR]])
})

test('should get value', (t) => {
  const { AsyncList, AsyncListReducer } = t.context

  const reducer = new AsyncListReducer(OPTIONS)

  reducer.handleSuccess(STATE, {
    payload: { start: START, end: END },
    value: {
      items: VALUES,
      total: TOTAL,
    },
  })

  t.deepEqual(AsyncList.prototype.handleSuccess.args, [
    [STATE, RANGE, VALUES, TOTAL],
  ])
})
