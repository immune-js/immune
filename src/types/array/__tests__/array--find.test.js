import
  { Maybe
  , find
  , equals
  } from "../../.."

test("it should return the first value that satisfies the predicate wrapped in a some", () => {
  expect(equals(find([1, 2, 3], x => x === 2 || x === 3), Maybe.Some(2))).toBe(true)
})

test("it should return none if no value satisfies the predicate", () => {
  expect(equals(find([1, 2, 3], x => x === 10), Maybe.None())).toBe(true)
})