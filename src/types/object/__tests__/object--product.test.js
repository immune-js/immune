import
  { product
  } from "../../.."

test("it should return the product of all values in an object", () => {
  expect(product({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })).toBe(720)
})