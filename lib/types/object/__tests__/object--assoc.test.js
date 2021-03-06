import { assoc } from '../../../index';

test("it should update an exisiting value", function () {
  expect(assoc({ x: 1, y: 2 }, "x", 4)).toEqual({ x: 4, y: 2 });
});

test("it should be non-destructive", function () {
  var arr = { x: 1, y: 2 };
  assoc(arr, "x", 4);
  expect(arr).toEqual({ x: 1, y: 2 });
});

test("it should create a new key if it doesn't exist", function () {
  expect(assoc({ x: 1, y: 2 }, 'z', 3)).toEqual({ x: 1, y: 2, z: 3 });
});