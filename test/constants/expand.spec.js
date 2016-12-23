import test from 'ava'

import expand from '../../lib/constants/index'

test('should expand a string into an array', (t) => {
  const constant = expand('CONSTANT')

  t.is(constant[0], 'CONSTANT_REQUEST')
  t.is(constant[1], 'CONSTANT_FAILURE')
  t.is(constant[2], 'CONSTANT_SUCCESS')
})

test('should expand a string into an object', (t) => {
  const constant = expand('CONSTANT')

  t.is(constant.REQUEST, 'CONSTANT_REQUEST')
  t.is(constant.FAILURE, 'CONSTANT_FAILURE')
  t.is(constant.SUCCESS, 'CONSTANT_SUCCESS')
})

test('should work with tagged templates', (t) => {
  const constant = expand`CONSTANT`

  t.is(constant.REQUEST, 'CONSTANT_REQUEST')
  t.is(constant.FAILURE, 'CONSTANT_FAILURE')
  t.is(constant.SUCCESS, 'CONSTANT_SUCCESS')
})
