import
  { foldr
  } from "../../.."

test("it should fold an object to a value starting from the right hand side", () => {
  expect(foldr([1, 2, 3], [], (acc, v) => acc.concat(v))).toEqual([3, 2, 1])
  expect(foldr([1, 2, 3], 0 , (acc, v) => acc + v      )).toEqual(6)
})