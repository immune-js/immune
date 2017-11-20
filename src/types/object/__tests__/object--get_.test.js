import
  { get_
  } from '../../../index'

test("it should return the value unwrapped when a non-null value exists for the given key", () => {
  expect(get_({ x: 1, y: 2 }, "x")).toBe(1)
})

test("it should return undefined when no value exists for the given key", () => {
  expect(get_({ x: 1, y: 2 }, "z")).toBe(undefined)
})