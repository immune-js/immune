import
  { filter
  } from "../../.."

test("it should return a new collection containing only the items that satisfies a predicate", () => {
  expect(filter({ a: 1, b: 2, c: 3, d: 4, e: 5 }, ([k, v]) => v <= 3)).toEqual({ a: 1, b: 2, c: 3 })
})