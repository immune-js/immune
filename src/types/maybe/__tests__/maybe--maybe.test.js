import
  { Some
  , None
  , maybe
  , caseOf
  , equals
  } from '../../../index'

test("it returns the value wrapped in a Some when it is non-null", () => {
  expect(equals(maybe(2), Some(2))).toBe(true)
})

test("it returns None when the value is null", () => {
  expect(equals(maybe(null), None())).toBe(true)
})

test("it returns None when the value is undefined", () => {
  expect(equals(maybe(undefined), None())).toBe(true)
})