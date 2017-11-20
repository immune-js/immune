import
  { Maybe
  , getIn
  , equals
  } from "../../.."

test("it should return the value wrapped in a some if one exists at the specified path", () => {
  expect(equals(getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 0]), Maybe.Some(1))).toBe(true)
  expect(equals(getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 2]), Maybe.Some(3))).toBe(true)
})

test("it should return none if no value exists at the specified path", () => {
  expect(equals(getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 6]), Maybe.None())).toBe(true)
})

test("it should return the value unwrapped in a some if a default value is provided", () => {
  expect(getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 0], 10)).toBe(1)
  expect(getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 2], 10)).toBe(3)
})

test("it should return the default value if no value exists at the specified path", () => {
  expect(getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 6], 10)).toBe(10)
})