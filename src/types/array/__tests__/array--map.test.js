import
  { map
  } from "../../../index"

test("it creates a new array from the result of applying a function to each element in a non-empty array", () => {
  expect(map([1,2,3], x => x + 1)).toEqual([2,3,4])
})

test("it doesn't modify the original array", () => {
  let orig = [1,2,3]
  map(orig, x => x + 1)
  expect(orig).toEqual([1, 2, 3])
})

test("it does nothing for empty arrays", () => {
  expect(map([], x => x + 1)).toEqual([])
})

test("it should curry the mapping function", () =>
  expect(map(map([1, 2, 3], (x, y) => x + y), f => f(4))).toEqual([5, 6, 7])
)