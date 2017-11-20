import
  { keys
  } from "../../.."


test("it should return a list of all the indices in an array", () => {
  expect(keys(["a", "b", "c"])).toEqual([0, 1, 2])
})