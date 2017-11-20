const
  { IMMUNE_IS_ANY_SYM
  , Any
  , is
  , IShow
  , Union
  } = require('../../../index.js')

test('Any defines isAny', () => {
  expect(Any[IMMUNE_IS_ANY_SYM]).toBe(true)
})

test('Any implements toString', () => {
  expect(Any.toString()).toBe('Any')
})