import { Ok, Err, andThen, equals } from "../../..";

test("it should map a function over a Some and flatten the result", function () {
  expect(equals(andThen(Ok(2), function (x) {
    return Ok(x + 4);
  }), Ok(6))).toBe(true);
});

test("it should return Err when invoked over Err", function () {
  expect(equals(andThen(Err("error!"), function (x) {
    return Ok(x + 4);
  }), Err("error!"))).toBe(true);
});

test("it should return Err if the function returns Err", function () {
  expect(equals(andThen(Ok(2), function (x) {
    return Err("error!");
  }), Err("error!"))).toBe(true);
});