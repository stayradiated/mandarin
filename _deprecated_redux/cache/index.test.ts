import { test, expect } from 'vitest'
import { cacheMap, cacheValue, cacheList, cacheMapList } from './index.js'

test('should export values', () => {
  expect(cacheValue).toBeTypeOf('function')
  expect(cacheMap).toBeTypeOf('function')
  expect(cacheList).toBeTypeOf('function')
  expect(cacheMapList).toBeTypeOf('function')
})
