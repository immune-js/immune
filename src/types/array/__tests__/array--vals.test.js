
import
  { vals
  } from "../../.."


test("it should return a list of all the values in an array", () => {
  expect(vals(["a", "b", "c"])).toEqual(["a", "b", "c"])
})