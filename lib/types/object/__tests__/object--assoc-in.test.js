import { assocIn } from '../../../index';

test("it allows updating deeply nested paths of objects", function () {
  var coll = { x: { y: { z: 2 } } };

  expect(assocIn(coll, ["x", "y", "z"], 44)).toEqual({ x: { y: { z: 44 } } });
});

test("it allows creating new paths in objects", function () {
  expect(assocIn({}, ['x', 'y', 'z'], 2)).toEqual({ x: { y: { z: 2 } } });
});

test("it doesn't modify the original", function () {
  var coll = { x: { y: { z: 2 } } };
  assocIn(coll, ["x", "y", "z"], 44);
  expect(coll).toEqual({ x: { y: { z: 2 } } });
});