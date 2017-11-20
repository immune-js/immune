import { equals } from '../../../index';

test("it should return true if the contents of two arrays are equal", function () {
  expect(equals([1, 2, 3], [1, 2, 3])).toBe(true);
});

test("it should return false if the contents of two arrays aren't equal", function () {
  expect(equals([1, 2, 3], [2, 3, 4])).toBe(false);
});

test("it should work over nested arrays", function () {
  expect(equals([[1, [2]], [3]], [[1, [2]], [3]])).toBe(true);
});