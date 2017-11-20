import
  { foldl
  } from "../../.."

test("it should fold an array to a value from the left", () => {
  expect(foldl([1, 2, 3], [], (acc, v) => acc.concat(v))).toEqual([1, 2, 3])
  expect(foldl([1, 2, 3], 0 , (acc, v) => acc + v      )).toEqual(6)
})