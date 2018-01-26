import test from 'ava'

import sinon from 'sinon'
import stu from 'stu'

const NEXT_RESULT = 'NEXT_RESULT'
const STATE = 'STATE'
const REQUEST = 'REQUEST'
const FAILURE = 'FAILURE'
const SUCCESS = 'SUCCESS'
const TYPES = [REQUEST, FAILURE, SUCCESS]
const VALUE = 'VALUE'
const PAYLOAD = 'PAYLOAD'

test.beforeEach((t) => {
  stu((mock, require) => {
    t.context.reduxAsync = require('./index').default
  }).mock()

  t.context.store = { getState: sinon.stub().returns(STATE) }
  t.context.next = sinon.stub().returns(NEXT_RESULT)
})

test('should ignore unmarked actions', (t) => {
  const { store, next, reduxAsync } = t.context

  const action = {
    type: 'STANDARD_ACTION'
  }

  t.is(reduxAsync(store)(next)(action), NEXT_RESULT)

  t.deepEqual(next.args, [[action]])
})

test('should throw an error if types are not defined', (t) => {
  const { store, next, reduxAsync } = t.context

  const action = {
    meta: {
      async: Promise.resolve(VALUE)
    }
  }

  t.throws(() => {
    reduxAsync(store)(next)(action)
  })
})

test('should dispatch the REQUEST action', (t) => {
  const { store, next, reduxAsync } = t.context
  t.plan(5)

  const action = {
    types: TYPES,
    payload: PAYLOAD,
    meta: {
      async: Promise.resolve(VALUE)
    }
  }

  return reduxAsync(store)(next)(action)
    .then((value) => {
      t.is(value, VALUE)

      t.true(next.callCount > 1)
      const args = next.args[0][0]

      t.is(args.type, REQUEST)
      t.is(args.payload, PAYLOAD)

      return args.promise
    })
    .then((value) => {
      t.is(value, VALUE)
    })
})

test('should dispatch the FAILURE action', (t) => {
  const { store, next, reduxAsync } = t.context
  t.plan(6)

  const ERROR = 'ERROR'
  const PROMISE = Promise.reject(ERROR)

  const action = {
    types: TYPES,
    payload: PAYLOAD,
    meta: {
      async: PROMISE
    }
  }

  return reduxAsync(store)(next)(action)
    .catch((error) => {
      t.is(error, ERROR)

      t.true(next.callCount >= 2)
      const args = next.args[1][0]

      t.is(args.type, FAILURE)
      t.is(args.payload, PAYLOAD)
      t.is(args.error, ERROR)

      return args.promise
    })
    .catch((error) => {
      t.is(error, ERROR)
    })
})

test('should dispatch the SUCCESS action', (t) => {
  const { store, next, reduxAsync } = t.context
  t.plan(6)

  const action = {
    types: TYPES,
    payload: PAYLOAD,
    meta: {
      async: VALUE // NOTE: passing a value directly
    }
  }

  return reduxAsync(store)(next)(action)
    .then((value) => {
      t.is(value, VALUE)

      t.true(next.callCount >= 2)
      const args = next.args[1][0]

      t.is(args.type, SUCCESS)
      t.is(args.payload, PAYLOAD)
      t.is(args.value, VALUE)

      return args.promise
    })
    .then((value) => {
      t.is(value, VALUE)
    })
})
