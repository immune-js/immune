import { Ok, Err, equals, flatten } from "../../../";

test("it should extract the inner Ok from a nested Ok", function () {
  expect(equals(flatten(Ok(Ok(2))), Ok(2))).toBe(true);
});

test("it should return Err if Err is wrapped inside the Ok", function () {
  expect(equals(flatten(Ok(Err("error!"))), Err("error!"))).toBe(true);
});

test("it should return Err if called on Err", function () {
  expect(equals(flatten(Err("error!")), Err("error!"))).toBe(true);
});