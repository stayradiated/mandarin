import test from 'ava'
import * as index from './index'

test('should export classes', (t) => {
  t.is(typeof index.createListSelector, 'function')
  t.is(typeof index.createMapListSelector, 'function')
  t.is(typeof index.createMapSelector, 'function')
  t.is(typeof index.createValueSelector, 'function')
  t.is(typeof index.exportValue, 'function')
})
