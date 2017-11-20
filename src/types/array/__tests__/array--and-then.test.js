import
  { map
  , andThen
  } from "../../../index"

test("it produces a new result by applying a function to each element and flattens the result", () => {
  expect(andThen([1, 2, 3], x => [x, x])).toEqual([1, 1, 2, 2, 3, 3])
})

test("it should return empty array if the array is empty", () => {
  expect(andThen([], x => [x, x])).toEqual([])
})