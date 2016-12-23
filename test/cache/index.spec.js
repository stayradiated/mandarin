import test from 'ava'

import {cacheMap, cacheValue} from '../../lib/cache/index'

test('should export values', (t) => {
  t.is(typeof cacheValue, 'function')
  t.is(typeof cacheMap, 'function')
})
