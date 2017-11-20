import
  { slice
  } from "../../.."

test("it should return a new array of all the values in the original that exsists within the specified range (inclusive)", () =>
  expect(slice([1, 2, 3, 4, 5, 6], 1, 4)).toEqual([2, 3, 4])
)

test("to should default to the length of the array", () => 
  expect(slice([1, 2, 3, 4, 5, 6], 1)).toEqual([2, 3, 4, 5, 6])
)

test("from should default to zero", () => 
  expect(slice([1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6])
)