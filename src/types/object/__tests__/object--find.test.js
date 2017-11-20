import
  { Maybe
  , find
  , equals
  } from "../../.."

test("it should return the first key/value pair that satisfies the predicate wrapped in a some", () => {
  expect(equals(find({ a: 2, b: 2, c: 2 }, ([k, v]) => k === "b" && v === 2), Maybe.Some(["b", 2]))).toBe(true)
})

test("it should return none if no value satisfies the predicate", () => {
  expect(equals(find({ a: 2, b: 2, c: 2 }, ([k, v]) => v === 10), Maybe.None())).toBe(true)
})