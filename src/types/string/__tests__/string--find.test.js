import
  { Maybe
  , find
  , equals
  } from "../../.."

test("it should return the first char that satisfies the predicate wrapped in a some", () => {
  expect(equals(find("foobar", x => x === "b" || x === "a"), Maybe.Some("b"))).toBe(true)
})

test("it should return none if no value satisfies the predicate", () => {
  expect(equals(find("foobar", x => x === "z"), Maybe.None())).toBe(true)
})