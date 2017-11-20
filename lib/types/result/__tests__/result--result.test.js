import { Ok, Err, result, equals } from '../../../index';

test("it returns the value wrapped in a Ok when it is non-null", function () {
  expect(equals(result(2, "error!"), Ok(2))).toBe(true);
});

test("it returns Err when the value is null", function () {
  expect(equals(result(null, "error!"), Err("error!"))).toBe(true);
});

test("it returns Err when the value is undefined", function () {
  expect(equals(result(undefined, "error!"), Err("error!"))).toBe(true);
});