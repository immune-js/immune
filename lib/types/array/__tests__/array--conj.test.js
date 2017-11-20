import { conj } from "../../..";

test("given add a value to the end of the array", function () {
  expect(conj([1, 2, 3], 4)).toEqual([1, 2, 3, 4]);
});

test("given multiple values it should add them to the end", function () {
  expect(conj([1, 2], 3, 4, 5)).toEqual([1, 2, 3, 4, 5]);
});

test("it should add an array's without flattening", function () {
  expect(conj([[1, 2]], [3, 4])).toEqual([[1, 2], [3, 4]]);
});