import { test, expect } from 'vitest'
import * as index from './index.js'

test('index exports all submodules', () => {
  expect(index.fetchList).toBeTypeOf('function')
})
