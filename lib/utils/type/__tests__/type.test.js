import { Type, is } from "../../../index";

import EJSON from "meteor-ejson";

test("Type requires a name parameter", function () {
  expect(function () {
    Type({});
  }).toThrow(new TypeError("Type requires a name parameter"));
});

test("Type requires a spec parameter", function () {
  expect(function () {
    Type("");
  }).toThrow(new TypeError("Type requires a specification"));
});

test("Type constructors created with Type requires the number of arguments to match the number of keys in specification", function () {
  var MyType = Type('MyType', { stuff: Number });
  expect(function () {
    return MyType();
  }).toThrow(new TypeError("Too few arguments 0/1 passed to type constructor: MyType"));
  expect(function () {
    return MyType(1, 2);
  }).toThrow(new TypeError("Too many arguments 2/1 passed to type constructor: MyType"));
});

test("Type constructor typechecks its arguments", function () {
  var MyType = Type("MyType", { a: Number, b: String });
  expect(function () {
    return MyType("foo", 23);
  }).toThrow(new TypeError("The type of the arguments passed to type constructor MyType({ a: Number, b: String }) does not match the expected types"));
});

test("Type creates a constructor function", function () {
  var MyType = Type("MyType", { stuff: Number });
  expect(MyType(2) instanceof MyType).toBe(true);
  expect(MyType(2).stuff).toBe(2);
});

test("Type is serializable", function () {
  var MyType = Type("MyType", { x: Number, y: String });
  expect(MyType(2, "foo").toJSONValue()).toEqual({ x: 2, y: "foo" });
});

test("Type is de-serializable", function () {
  var MyType = Type("_MyType", { x: Number, y: String });
  expect(EJSON.parse(EJSON.stringify(MyType(2, "foo"))) instanceof MyType).toEqual(true);
});

test("Type should throw exception when attempting to desirialize if it contains functions", function () {
  var MyType = Type("MyType", { fork: Function });
  expect(function () {
    return EJSON.stringify(MyType(function (x) {
      return x + 1;
    }));
  }).toThrow("Unable to serialize MyType({ fork: Function }) since it contains functions.");
});