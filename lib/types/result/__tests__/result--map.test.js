import { Ok, Err, map, caseOf, equals } from "../../../index";

test("it returns a new Ok containing the result of applying a function to the value of another Ok", function () {
  expect(equals(map(Ok(2), function (x) {
    return x + 1;
  }), Ok(3))).toBe(true);
});

test("it is non-destructive", function () {
  var maybeTwo = Ok(2);

  map(maybeTwo, function (x) {
    return x + 1;
  });

  expect(caseOf(maybeTwo, { _: function _(_2) {
      return _2;
    } })).toBe(2);
});

test("it does nothing for Err", function () {
  expect(equals(map(Err("error!"), function (x) {
    return x + 1;
  }), Err("error!"))).toBe(true);
});

test("it should curry the mapping function", function () {
  return expect(caseOf(map(Ok(2), function (x, y) {
    return x + y;
  }), { Ok: function Ok(f) {
      return f(4);
    },
    Err: function Err(err) {
      return err;
    }
  })).toBe(6);
});