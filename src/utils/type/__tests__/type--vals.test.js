import
  { Type
  , vals
  , show
  } from "../../../index"

test("it should return a list of all the values", () => {
  const MyType = Type("MyType", { x: Number, y: Number, z: Number })
  expect(vals(MyType(1, 2, 3))).toEqual([1, 2, 3])
})