import test from 'ava'
import * as index from './index'

test('should export classes', (t) => {
  t.is(typeof index.AsyncListReducer, 'function')
  t.is(typeof index.AsyncMapListReducer, 'function')
  t.is(typeof index.AsyncMapReducer, 'function')
  t.is(typeof index.AsyncValueReducer, 'function')
})
