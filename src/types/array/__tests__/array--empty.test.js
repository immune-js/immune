import
  { empty
  } from "../../../index"
  
test("it returns an empty array", () => {
  expect(empty([1,2,3])).toEqual([])
})