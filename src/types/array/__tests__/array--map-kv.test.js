import
  { mapKV
  } from "../../../index"

test("it creates a new array from the result of applying a function to each key/value pair in a non-empty array", () => {
  expect(mapKV([1,2,3], ([k, v]) => [k, v])).toEqual([[0, 1],[1, 2], [2, 3]])
})

test("it doesn't modify the original array", () => {
  let orig = [1,2,3]
  mapKV(orig, ([k, v]) => [k, v])
  expect(orig).toEqual([1, 2, 3])
})

test("it does nothing for empty arrays", () => {
  expect(mapKV([], ([k, v]) => [k, v])).toEqual([])
})