import
  { show
  } from '../../../index'

test('it implements IShow.show', () => {
  expect(show([1, 2, 3])).toBe('[ 1, 2, 3 ]')
  expect(show([1, ["2", "3"]])).toBe('[ 1, [ "2", "3" ] ]')
})