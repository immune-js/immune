import
  { vals
  } from "../../.."


test("it should return a list of all the individual characters in a string", () => {
  expect(vals("abc")).toEqual(["a", "b", "c"])
})