import
  { conj
  , foldKV
  } from "../../.."

test("it should pass both the index and character to the transformation function", () => {
  expect(foldKV("foo", [], (acc, [k, v]) => conj(acc, [k, v]))).toEqual([[0, "f"], [1, "o"], [2, "o"]])
})