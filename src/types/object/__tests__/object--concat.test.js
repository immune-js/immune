import
  { concat
  } from "../../.."

test("it should concatenate two objects", () => {
  expect(concat({ a: 1, b: 2 }, { c: 3, d: 4 })).toEqual({ a: 1, b: 2, c: 3, d: 4 })
})

test("it should concatenate multiple objects", () => {
  expect(concat({ a: 1, b: 2 }, { c: 3, d: 4 }, { e: 5, f: 6 })).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })
})

test("it should overwrite duplicate keys", () => {
  expect(concat({ a: 1 }, { a: 4, b: 2 }, { b: 3 })).toEqual({ a: 4, b: 3 })
})