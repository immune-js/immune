import { Some, None, map, caseOf, equals } from "../../../index";

test("it returns a new Some containing the result of applying a function to the value of another Some", function () {
  expect(equals(map(Some(2), function (x) {
    return x + 1;
  }), Some(3))).toBe(true);
});

test("it is non-destructive", function () {
  var maybeTwo = Some(2);

  map(maybeTwo, function (x) {
    return x + 1;
  });

  expect(caseOf(maybeTwo, { _: function _(_2) {
      return _2;
    } })).toBe(2);
});

test("it does nothing for None", function () {
  expect(equals(map(None(), function (x) {
    return x + 1;
  }), None())).toBe(true);
});

test("it should curry the mapping function", function () {
  return expect(caseOf(map(Some(2), function (x, y) {
    return x + y;
  }), { Some: function Some(f) {
      return f(4);
    },
    None: function None() {
      return 0;
    }
  })).toBe(6);
});