import
  { OneOf
  , show
  } from "../../../index"

test('it returns a string representation of OneOf instances', () => {
  expect(show(OneOf(Number, String))).toBe('OneOf(Number, String)')
})
