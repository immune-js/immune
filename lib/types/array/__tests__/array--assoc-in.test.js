import { assocIn } from '../../../index';

test("it allows updating deeply nested paths of arrays", function () {
  var coll = [1, [2, [3, 4]]];

  expect(assocIn(coll, [1, 1, 0], 44)).toEqual([1, [2, [44, 4]]]);
});

test("it doesn't modify the original array", function () {
  var coll = [1, [2, [3, 4]]];

  assocIn(coll, [1, 1, 0], 44);
  expect(coll).toEqual([1, [2, [3, 4]]]);
});