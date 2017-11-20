import
  { mapKeys
  } from "../../../index"

test("it creates a new array from the result of applying a function to each key in a non-empty array", () => {
  expect(mapKeys([1,2,3], k => k)).toEqual([0, 1, 2])
})

test("it doesn't modify the original array", () => {
  let orig = [1,2,3]
  mapKeys(orig, k => k)
  expect(orig).toEqual([1, 2, 3])
})

test("it does nothing for empty arrays", () => {
  expect(mapKeys([], k => k)).toEqual([])
})