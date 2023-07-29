import { test, expect } from 'vitest'
import { newActionType } from './index.js'

test('should expand a string into an array', () => {
  const constant = newActionType('CONSTANT')

  expect(constant[0]).toBe('CONSTANT_REQUEST')
  expect(constant[1]).toBe('CONSTANT_FAILURE')
  expect(constant[2]).toBe('CONSTANT_SUCCESS')
})

test('should expand a string into an object', () => {
  const constant = newActionType('CONSTANT')

  expect(constant.REQUEST).toBe('CONSTANT_REQUEST')
  expect(constant.FAILURE).toBe('CONSTANT_FAILURE')
  expect(constant.SUCCESS).toBe('CONSTANT_SUCCESS')
})

test('should work with tagged templates', () => {
  const constant = newActionType`CONSTANT`

  expect(constant.REQUEST).toBe('CONSTANT_REQUEST')
  expect(constant.FAILURE).toBe('CONSTANT_FAILURE')
  expect(constant.SUCCESS).toBe('CONSTANT_SUCCESS')
})
