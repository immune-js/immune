import { compose } from "../../..";

test("it should return a new function that is the composition of multiple fns", function () {
  var f = function f(x) {
    return x.concat(5);
  };
  var g = function g(x) {
    return x.concat(4);
  };
  var y = function y(x, _y, z) {
    return [x, _y, z];
  };

  expect(compose(f, g, y)(1, 2, 3)).toEqual(f(g(y(1, 2, 3))));
  expect(compose(f, g, y)(1, 2, 3)).toEqual([1, 2, 3, 4, 5]);
});