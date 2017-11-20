import { typeToStr } from '../';

import { Null, Any, Union, Type, Maybe } from '../../../';

// -- Values

test("it should return a string representation of null", function () {
  expect(typeToStr(null)).toEqual('Null');
});

test("it should return a string representation of undefined", function () {
  expect(typeToStr(undefined)).toEqual('Null');
});

test("it should qoute strings", function () {
  expect(typeToStr("foo")).toBe('"foo"');
});

test("it should return a stringified version of object shapes", function () {
  expect(typeToStr({ foo: Number, x: { y: String } })).toBe("{ foo: Number, x: { y: String } }");
});

test("it should return a stringified version of array shapes", function () {
  expect(typeToStr([Number, [String]])).toBe("[ Number, [ String ] ]");
});

// -- Types

test("it should extract the typename of Null", function () {
  expect(typeToStr(Null)).toEqual('Null');
});

test("it should extract the typename of Object", function () {
  expect(typeToStr(Object)).toEqual('Object');
});

test("it should extract the typename of Array", function () {
  expect(typeToStr(Array)).toEqual('Array');
});

test("it should extract the typename of String", function () {
  expect(typeToStr(String)).toEqual('String');
});

test("it should extract the typename of Number", function () {
  expect(typeToStr(Number)).toEqual('Number');
});

test("it should extract the typename of RegExp", function () {
  expect(typeToStr(RegExp)).toEqual('RegExp');
});

test("it should extract the typename of Any", function () {
  expect(typeToStr(Any)).toEqual('Any');
});

test("it should extract the typename of Union", function () {
  expect(typeToStr(Union)).toEqual('Union');
});

test("it should extract the typename of Union types", function () {
  expect(typeToStr(Maybe)).toEqual('Maybe');
});

test("it should extract the typename of Union instances", function () {
  expect(typeToStr(Maybe.Some(2))).toEqual('Maybe.Some');
  expect(typeToStr(Maybe.None())).toEqual('Maybe.None');
});