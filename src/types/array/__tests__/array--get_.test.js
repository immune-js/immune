import
  { get_
  } from '../../../index'

test("it should return the value unwrapped when non-null value exists at the specified index", () => {
  expect(get_([1,2,3], 0)).toBe(1)
})

test("it should return undefined when the index is out of range", () => {
  expect(get_([1,2,3], 4)).toBe(undefined)
})