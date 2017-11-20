import
  { Type
  , get
  , show
  } from "../../../index"

test("it should return the value at the given key wrapped in a some if it exists", () => {
  const MyType = Type("MyType", { x: Number, y: Number, z: Number })
  expect(show(get(MyType(1, 2, 3), "y"))).toEqual("Maybe.Some(2)")
})

test("it should return none if no value exists at the given key", () => {
  const MyType = Type("MyType", { x: Number, y: Number, z: Number })
  expect(show(get(MyType(1, 2, 3), "a"))).toEqual("Maybe.None()")
})