import
  { Some
  , None
  , equals
  } from '../../../index'

test("it returns true when compating Some's whose content are equal", () => {
  expect(equals(Some(4), Some(4))).toBe(true)
})

test("it returns false when comparing Some's whose content are not equal", () => {
  expect(equals(Some(4), Some(2))).toBe(false)
})

test("it returns true when comparing None's", () => {
  expect(equals(None(), None())).toBe(true)
})

test("it returns false when comparing Some to None", () => {
  expect(equals(Some(2), None())).toBe(false)
})

test("it returns false when comparing None to Some", () => {
  expect(equals(None(), Some(2))).toBe(false)
})