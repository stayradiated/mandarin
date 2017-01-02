import test from 'ava'
import stu from 'stu'
import PirateMap from 'piratemap'

test.beforeEach((t) => {
  stu((mock, require) => {
    t.context.AsyncList = mock('../../lib/reducer/AsyncList').default
    t.context.AsyncListReducer = require('../../lib/reducer/AsyncListReducer').default
  }).mock()
})

const STATE = 'STATE'
const START = 0
const END = 5
const RANGE = [START, END]
const PROMISE = 'PROMISE'
const ERROR = 'ERROR'
const VALUE = ['V', 'A', 'L', 'U', 'E']
const OPTIONS = {
  values: 'values',
  errors: 'errors',
  promises: 'promises',
  fetched: 'fetched',
}

test('should create a new instance', (t) => {
  const {AsyncList, AsyncListReducer} = t.context

  const reducer = new AsyncListReducer(OPTIONS)

  t.is(AsyncList.calledOnce, true)

  t.is(typeof reducer.getPromise, 'function')
  t.is(typeof reducer.getError, 'function')
  t.is(typeof reducer.getValue, 'function')

  t.deepEqual(reducer.initialState, {
    errors: new PirateMap(),
    fetched: new PirateMap(),
    promises: new PirateMap(),
    values: []
  })
})

test('should get promise', (t) => {
  const {AsyncList, AsyncListReducer} = t.context

  const reducer = new AsyncListReducer(OPTIONS)

  reducer.handleRequest(STATE, {
    payload: {start: START, end: END},
    promise: PROMISE,
  })

  t.deepEqual(AsyncList.prototype.handleRequest.args, [[
    STATE, RANGE, PROMISE,
  ]])
})

test('should get error', (t) => {
  const {AsyncList, AsyncListReducer} = t.context

  const reducer = new AsyncListReducer(OPTIONS)

  reducer.handleFailure(STATE, {
    payload: {start: START, end: END},
    error: ERROR,
  })

  t.deepEqual(AsyncList.prototype.handleFailure.args, [[
    STATE, RANGE, ERROR,
  ]])
})

test('should get value', (t) => {
  const {AsyncList, AsyncListReducer} = t.context

  const reducer = new AsyncListReducer(OPTIONS)

  reducer.handleSuccess(STATE, {
    payload: {start: START, end: END},
    value: VALUE,
  })

  t.deepEqual(AsyncList.prototype.handleSuccess.args, [[
    STATE, RANGE, VALUE,
  ]])
})
