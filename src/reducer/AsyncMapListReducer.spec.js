import test from 'ava'
import stu from 'stu'
import PirateMap from 'piratemap'

test.beforeEach((t) => {
  stu((mock, require) => {
    t.context.AsyncMapList = mock('./AsyncMapList').default
    t.context.AsyncMapListReducer = require('./AsyncMapListReducer').default
  }).mock()
})

const STATE = 'STATE'
const ID = 123
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
  values: 'values'
}

test('should create a new instance', (t) => {
  const { AsyncMapList, AsyncMapListReducer } = t.context

  const reducer = new AsyncMapListReducer(OPTIONS)

  t.is(AsyncMapList.calledOnce, true)

  t.is(typeof reducer.getPromise, 'function')
  t.is(typeof reducer.getError, 'function')
  t.is(typeof reducer.getValues, 'function')

  t.deepEqual(reducer.initialState, {
    errors: new PirateMap(),
    fetched: new PirateMap(),
    promises: new PirateMap(),
    values: new Map()
  })
})

test('should get promise', (t) => {
  const { AsyncMapList, AsyncMapListReducer } = t.context

  const reducer = new AsyncMapListReducer(OPTIONS)

  reducer.handleRequest(STATE, {
    payload: { id: ID, start: START, end: END },
    promise: PROMISE
  })

  t.deepEqual(AsyncMapList.prototype.handleRequest.args, [[
    STATE, ID, RANGE, PROMISE
  ]])
})

test('should get error', (t) => {
  const { AsyncMapList, AsyncMapListReducer } = t.context

  const reducer = new AsyncMapListReducer(OPTIONS)

  reducer.handleFailure(STATE, {
    payload: { id: ID, start: START, end: END },
    error: ERROR
  })

  t.deepEqual(AsyncMapList.prototype.handleFailure.args, [[
    STATE, ID, RANGE, ERROR
  ]])
})

test('should get value', (t) => {
  const { AsyncMapList, AsyncMapListReducer } = t.context

  const reducer = new AsyncMapListReducer(OPTIONS)

  reducer.handleSuccess(STATE, {
    payload: { id: ID, start: START, end: END },
    value: {
      items: VALUES,
      total: TOTAL
    }
  })

  t.deepEqual(AsyncMapList.prototype.handleSuccess.args, [[
    STATE, ID, RANGE, VALUES, TOTAL
  ]])
})

test('should reset state', (t) => {
  const { AsyncMapList, AsyncMapListReducer } = t.context

  const reducer = new AsyncMapListReducer(OPTIONS)

  reducer.handleReset(STATE, {
    payload: { id: ID }
  })

  t.deepEqual(AsyncMapList.prototype.handleReset.args, [[
    STATE, ID
  ]])
})

test('should modifyItemValues', (t) => {
  const { AsyncMapList, AsyncMapListReducer } = t.context

  const reducer = new AsyncMapListReducer(OPTIONS)

  const UPDATE_FN = 'UPDATE_FN'

  reducer.modifyItemValues(STATE, { payload: { id: ID } }, UPDATE_FN)

  t.deepEqual(AsyncMapList.prototype.modifyItemValues.args, [[
    STATE, ID, UPDATE_FN
  ]])
})
