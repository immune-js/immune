import
  { Ok
  , Err
  , result
  , equals
  } from '../../../index'

test("it returns the value wrapped in a Ok when it is non-null", () => {
  expect(equals(result(2, "error!"), Ok(2))).toBe(true)
})

test("it returns Err when the value is null", () => {
  expect(equals(result(null, "error!"), Err("error!"))).toBe(true)
})

test("it returns Err when the value is undefined", () => {
  expect(equals(result(undefined, "error!"), Err("error!"))).toBe(true)
})