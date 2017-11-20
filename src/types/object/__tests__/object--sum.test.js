import
  { sum
  } from "../../.."

test("it should return the sum of all value of an object", () => {
  expect(sum({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })).toBe(21)
})