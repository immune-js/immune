import
  { empty
  } from "../../../index"
  
test("it returns an empty object", () => {
  expect(empty({ x: 1, y: 2 })).toEqual({})
})