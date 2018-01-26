import test from 'ava'

import { cacheMap, cacheValue, cacheList, cacheMapList } from './index'

test('should export values', (t) => {
  t.is(typeof cacheValue, 'function')
  t.is(typeof cacheMap, 'function')
  t.is(typeof cacheList, 'function')
  t.is(typeof cacheMapList, 'function')
})
