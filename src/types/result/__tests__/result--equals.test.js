import
  { Ok
  , Err
  , equals
  } from '../../../index'

test("it returns true when compating Ok's whose content are equal", () => {
  expect(equals(Ok(4), Ok(4))).toBe(true)
})

test("it returns false when comparing Ok's whose content are not equal", () => {
  expect(equals(Ok(4), Ok(2))).toBe(false)
})

test("it returns true when comparing Err's whose content are equal", () => {
  expect(equals(Err("error!"), Err("error!"))).toBe(true)
})

test("it returns true when comparing Err's whose content are not equal", () => {
  expect(equals(Err("oops!"), Err("error!"))).toBe(false)
})

test("it returns false when comparing Ok to Err", () => {
  expect(equals(Ok(2), Err("error!"))).toBe(false)
})

test("it returns false when comparing Err to Ok", () => {
  expect(equals(Err("error!"), Ok(2))).toBe(false)
})

test("it retursn false when comparing Ok and Err with the same content", () => {
  expect(equals(Ok(2), Err(2))).toBe(false)
})

test("it retursn false when comparing Err and Ok with the same content", () => {
  expect(equals(Err(2), Ok(2))).toBe(false)
})