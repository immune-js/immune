import
  { mapKV
  } from '../../../'

test("it produces list of results by applying a function to each index and character", () => {
  expect(mapKV("foo", ([k, v]) => [k, v])).toEqual([[0, "f"], [1, "o"], [2, "o"]])
})