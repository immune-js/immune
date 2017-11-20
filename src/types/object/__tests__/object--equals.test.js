import
  { equals
  } from '../../../index'

test("it should return true if the keys and values of two objects are equal", () => {
  expect(equals({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 })).toBe(true)
})

test("it should return false if the keys of two objects aren't equal", () => {
  expect(equals({ x: 1, y: 2, z: 3 }, { a: 1, b: 2, c: 3 })).toBe(false)
})

test("it should return false if the values of two objects aren't equal", () => {
  expect(equals({ x: 1, y: 2, z: 3 }, { x: 3, y: 2, z: 1 })).toBe(false)
})

test("it should work over nested objects", () => {
  expect(equals({ x: { y: 2 }, z: [3] }, { x: { y: 2 }, z: [3] })).toBe(true)
})