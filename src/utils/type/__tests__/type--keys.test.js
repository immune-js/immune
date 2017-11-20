import
  { Type
  , keys
  , show
  } from "../../../index"

test("it should return a list of all the keys", () => {
  const MyType = Type("MyType", { x: Number, y: Number, z: Number })
  expect(keys(MyType(1, 2, 3))).toEqual(["x", "y", "z"])
})