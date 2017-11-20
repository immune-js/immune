import
  { map
  , ap
  } from "../../../index"

test("it should apply each value in one array to each function in another", () => {
  expect(ap([x => x * 2, x => x + 3], [1, 2, 3])).toEqual([2, 4, 6, 4, 5, 6])
})

test("it should return empty array if the first array is empty", () => {
  expect(ap([], [1, 2, 3])).toEqual([])
})

test("it should return empty array if the second array is empty", () => {
  expect(ap([x => x * 2, x => x + 3], [])).toEqual([])
})

test("it should return empty array if both arrays are empty", () => {
  expect(ap([], [])).toEqual([])
})