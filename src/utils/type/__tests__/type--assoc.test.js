import
  { Type
  , assoc
  , show
  } from "../../../index"

test("it should update the value at the given key", () => {
  const MyType = Type("MyType", { x: Number, y: Number, z: Number })
  expect(assoc(MyType(1, 2, 3), "y", 5).y).toEqual(5)
})

test("it should be non destructive", () => {
  const MyType = Type("MyType", { x: Number, y: Number, z: Number })
  const myType = MyType(1, 2, 3)
  assoc(myType, "y", 5)
  expect(myType.y).toEqual(2)
})