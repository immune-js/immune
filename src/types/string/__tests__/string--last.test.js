import
  { Some
  , None
  , last
  , equals
  } from '../../..'

test("it returns the last char wrapped in a Some from a one character string", () => {
  expect(equals(last("a"), Some("a"))).toBe(true)
})

test("it returns the last char wrapped in a Some from a string with multiple characters", () => {
  expect(equals(last("bar"), Some("r"))).toBe(true)
})

test("it returns None when called on an empty string", () => {
  expect(equals(last(""), None())).toBe(true)
})