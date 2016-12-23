import test from 'ava'

import * as index from '../lib/index'

test('index exports all submodules', (t) => {
  t.is(typeof index.default, 'function')
  t.is(typeof index.cacheMap, 'function')
  t.is(typeof index.cacheValue, 'function')
  t.is(typeof index.c, 'function')
  t.is(typeof index.AsyncValueReducer, 'function')
  t.is(typeof index.AsyncMapReducer, 'function')
  t.is(typeof index.createValueSelector, 'function')
  t.is(typeof index.createMapSelector, 'function')
  t.is(typeof index.exportValue, 'function')
})
