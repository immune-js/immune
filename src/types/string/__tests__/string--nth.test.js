import
  { Some
  , None
  , nth
  , equals
  } from '../../../index'

test("it should return the value wrapped in a Some when non-null value exists at the specified index", () => {
  expect(equals(nth("abc", 0), Some("a"))).toBe(true)
})

test("it should return None when the index is out of range", () => {
  expect(equals(nth("abc", 4), None())).toBe(true)
})

test("it should return the value unwrapped when non-null value exists at the specified index and a default value is provided", () => {
  expect(nth("abc", 0, "x")).toBe("a")
})

test("it should return the default value when the index is out of range and a default was provided", () => {
  expect(nth("abc", 4, "x")).toBe("x")
})