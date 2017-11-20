import
  { Type
  , is
  } from "../../../index"

import EJSON from "meteor-ejson"

test("Type requires a name parameter", () => {
  expect(() => { Type({}) }).toThrow(new TypeError("Type requires a name parameter"))
})

test("Type requires a spec parameter", () => {
  expect(() => { Type("") }).toThrow(new TypeError("Type requires a specification"))
})

test("Type constructors created with Type requires the number of arguments to match the number of keys in specification", () => {
  let MyType = Type('MyType', { stuff: Number })
  expect(() => MyType()).toThrow(new TypeError("Too few arguments 0/1 passed to type constructor: MyType"))
  expect(() => MyType(1, 2)).toThrow(new TypeError("Too many arguments 2/1 passed to type constructor: MyType"))
})

test("Type constructor typechecks its arguments", () => {
  let MyType = Type("MyType", { a: Number, b: String })
  expect(() => MyType("foo", 23)).toThrow(new TypeError("The type of the arguments passed to type constructor MyType({ a: Number, b: String }) does not match the expected types"))
})

test("Type creates a constructor function", () => {
  let MyType = Type("MyType", { stuff: Number })
  expect(MyType(2) instanceof MyType).toBe(true)
  expect(MyType(2).stuff).toBe(2)
})

test("Type is serializable", () => {
  let MyType = Type("MyType", { x: Number, y: String })
  expect(MyType(2, "foo").toJSONValue()).toEqual({ x: 2, y: "foo"})
})

test("Type is de-serializable", () => {
  let MyType = Type("_MyType", { x: Number, y: String })
  expect(EJSON.parse(EJSON.stringify(MyType(2, "foo"))) instanceof MyType).toEqual(true)
})

test("Type should throw exception when attempting to desirialize if it contains functions", () => {
  let MyType = Type("MyType", { fork: Function })
  expect(() => EJSON.stringify(MyType(x => x + 1))).toThrow("Unable to serialize MyType({ fork: Function }) since it contains functions.")
})
