import { test, expect } from 'vitest'
import { cacheValue } from './cacheValue.js'

test('empty state → call fetch fn', async () => {
  const result = await cacheValue({
    fetch: async () => 'my value',
    selectors: {
      promise: () => undefined,
      fetched: () => false,
      value: () => undefined,
    },
  })

  expect(result).toBe('my value')
})

test('existing value + !fetched → return existing value', async () => {
  const result = await cacheValue({
    fetch: async () => 'fetch value',
    selectors: {
      promise: () => undefined,
      fetched: () => false,
      value: () => 'value value',
    },
  })

  expect(result).toBe('fetch value')
})

test('existing value + fetched → return existing value', async () => {
  const result = await cacheValue({
    fetch: async () => 'fetch value',
    selectors: {
      promise: () => undefined,
      fetched: () => true,
      value: () => 'value value',
    },
  })

  expect(result).toBe('value value')
})

test('existing promise → return existing promise', async () => {
  const result = await cacheValue({
    fetch: async () => 'fetch value',
    selectors: {
      promise: async () => 'promise value',
      fetched: () => false,
      value: () => undefined,
    },
  })

  expect(result).toBe('promise value')
})

test('existing promise & value → return existing promise', async () => {
  const result = await cacheValue({
    fetch: async () => 'fetch value',
    selectors: {
      promise: async () => 'promise value',
      fetched: () => true,
      value: () => 'value value',
    },
  })

  expect(result).toBe('promise value')
})
