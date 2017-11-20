import
  { Some
  , None
  , get
  , equals
  } from '../../../index'

test("it should return the value wrapped in a Some when non-null value exists at the specified key", () => {
  expect(equals(get({ x: 1, y: 2 }, "x"), Some(1))).toBe(true)
})

test("it should return a None when the key can't be found", () => {
  expect(equals(get({ x: 1, y: 2 }, "z"), None())).toBe(true)
})

test("it should return a None when the key points to a null value", () => {
  expect(equals(get({ x: null, y: 1 }, "x"), None())).toBe(true)
})

test("it should return a None when the key points to a undefined value", () => {
  expect(equals(get({ x: undefined, y: 1 }, "x"), None())).toBe(true)
})

test("it should return the value unwrapped when a default value is provided", () => {
  expect(get({ x: 1, y: 2 }, "x", 10)).toBe(1)
})

test("it should return the default value when the key can't be found", () => {
  expect(get({ x: 1, y: 2 }, "z", 10)).toBe(10)
})

test("it should return the default value when the key points to a null value", () => {
  expect(get({ x: null, y: 1 }, "x", 10)).toBe(10)
})

test("it should return the default value when the key points to an undefined value", () => {
  expect(get({ x: undefined, y: 1 }, "x", 10)).toBe(10)
})