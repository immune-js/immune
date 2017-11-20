import { curry } from "../../../";

test("it returns a function that accepts all arguments at once", function () {
  expect(curry(function (x, y, z) {
    return x + y + z;
  })(1, 2, 3)).toBe(6);
});

test("it returns a function that accepts one argument at a time", function () {
  expect(curry(function (x, y, z) {
    return x + y + z;
  })(1)(2)(3)).toBe(6);
});

test("it returns a function that accepts multiple arguments at a time", function () {
  expect(curry(function (x, y, z) {
    return x + y + z;
  })(1, 2)(3)).toBe(6);
});

test("it should not curry an already curried function", function () {
  var f = function f(x, y, z) {
    return x + y + z;
  };
  var curriedF = curry(f);
  var partialF1 = curriedF(1);
  var partialF2 = curriedF(1)(2);
  var partialF3 = curriedF(1, 2);

  expect(curry(f)).not.toBe(f);
  expect(curry(curriedF)).toBe(curriedF);
  expect(curry(partialF1)).toBe(partialF1);
  expect(curry(partialF2)).toBe(partialF2);
  expect(curry(partialF3)).toBe(partialF3);
});