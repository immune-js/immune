import
  { Some
  , None
  , first
  , equals
  } from '../../..'

test("it returns the first char wrapped in a Some from a one character string", () => {
  expect(equals(first("a"), Some("a"))).toBe(true)
})

test("it returns the first char wrapped in a Some from a string with multiple characters", () => {
  expect(equals(first("bar"), Some("b"))).toBe(true)
})

test("it returns None when called on an empty string", () => {
  expect(equals(first(""), None())).toBe(true)
})