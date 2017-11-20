import { map, concat, show } from "../../..";

test("it should return a function that is the composition of it self an another function", function () {
  var f = function f(x) {
    return concat(x, "!");
  };
  var g = function g(x) {
    return show(x);
  };
  var x = 2;

  expect(map(f, g)(x)).toBe("2!");
  expect(map(f, g)(x)).toBe(f(g(x)));
});