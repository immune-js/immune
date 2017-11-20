import 
  { show
  } from '../../../index'

test('it returns a string representation of a function', () => {
  expect(show(function foo (x, y) {})).toBe('function foo(x, y) { ... }')
})