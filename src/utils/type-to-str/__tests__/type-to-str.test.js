import
  { typeToStr
  } from '../'

import
  { Null
  , Any
  , Union
  , Type
  , Maybe
  } from '../../../'

// -- Values

test("it should return a string representation of null", () => {
  expect(typeToStr(null)).toEqual('Null')
})

test("it should return a string representation of undefined", () => {
  expect(typeToStr(undefined)).toEqual('Null')
})

test("it should qoute strings", () => {
  expect(typeToStr("foo")).toBe('"foo"')
})

test("it should return a stringified version of object shapes", () => {
  expect(typeToStr({ foo: Number, x: { y: String } })).toBe("{ foo: Number, x: { y: String } }")
})

test("it should return a stringified version of array shapes", () => {
  expect(typeToStr([ Number, [String] ])).toBe("[ Number, [ String ] ]")
})

// -- Types

test("it should extract the typename of Null", () => {
  expect(typeToStr(Null)).toEqual('Null')
})

test("it should extract the typename of Object", () => {
  expect(typeToStr(Object)).toEqual('Object')
})

test("it should extract the typename of Array", () => {
  expect(typeToStr(Array)).toEqual('Array')
})

test("it should extract the typename of String", () => {
  expect(typeToStr(String)).toEqual('String')
})

test("it should extract the typename of Number", () => {
  expect(typeToStr(Number)).toEqual('Number')
})

test("it should extract the typename of RegExp", () => {
  expect(typeToStr(RegExp)).toEqual('RegExp')
})

test("it should extract the typename of Any", () => {
  expect(typeToStr(Any)).toEqual('Any')
})

test("it should extract the typename of Union", () => {
  expect(typeToStr(Union)).toEqual('Union')
})

test("it should extract the typename of Union types", () => {
  expect(typeToStr(Maybe)).toEqual('Maybe')
})

test("it should extract the typename of Union instances", () => {
  expect(typeToStr(Maybe.Some(2))).toEqual('Maybe.Some')
  expect(typeToStr(Maybe.None( ))).toEqual('Maybe.None')
})