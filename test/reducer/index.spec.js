import test from 'ava'

import * as index from '../../lib/reducer/index'

test('should export classes', (t) => {
  t.is(typeof index.AsyncValueReducer, 'function')
  t.is(typeof index.AsyncMapReducer, 'function')
})
