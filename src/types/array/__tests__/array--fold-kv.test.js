import
  { conj
  , foldKV
  } from "../../.."

test("it should pass both the index and value to the transformation function", () => {
  expect(foldKV([ 1, 2, 3 ], [], (acc, [k, v]) => conj(acc, [k, v]))).toEqual([[0, 1], [1, 2], [2, 3]])
})