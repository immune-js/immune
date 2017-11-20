import { mapKeys } from "../../../index";

test("it returns a new object from the result of applying a function to each of it's keys", function () {
  expect(mapKeys({ x: 1, y: 2 }, function (k) {
    return k;
  })).toEqual(["x", "y"]);
});

test("it is non-destructive", function () {
  var obj = { x: 1, y: 2 };
  mapKeys(obj, function (k) {
    return k;
  });
  expect(obj).toEqual({ x: 1, y: 2 });
});

test("it returns an empty array given an empty object", function () {
  expect(mapKeys({}, function (k) {
    return k;
  })).toEqual([]);
});