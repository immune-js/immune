import
  { getIn_
  } from '../../../index'

test("it should return the value unwrapped when a non-null value exists for the given key", () => {
  expect(getIn_({ x: { y: 1 } }, ["x", "y"])).toBe(1)
})

test("it should return undefined when no value exists for the given key", () => {
  expect(getIn_({ }, ["x", "z"])).toBe(undefined)
})