import
  { empty
  } from "../../../index"
  
test("it returns an empty string", () => {
  expect(empty("abc")).toEqual("")
})