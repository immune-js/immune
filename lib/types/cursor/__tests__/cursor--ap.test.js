import { cursor, ap } from "../../..";

test("it should delegate to its underlying collection", function () {
  expect(ap(cursor([function (x) {
    return x * 2;
  }, function (x) {
    return x + 3;
  }]), [1, 2, 3])).toEqual([2, 4, 6, 4, 5, 6]);
  expect(ap(cursor([[function (x) {
    return x * 2;
  }, function (x) {
    return x + 3;
  }]], [0]), [1, 2, 3])).toEqual([2, 4, 6, 4, 5, 6]);
});