import { slice } from "../../..";

test("it should return a new object of all the key/value pairs in the original that exists within the specified range (inclusive)", function () {
  return expect(slice({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, 1, 4)).toEqual({ b: 2, c: 3, d: 4 });
});

test("to should default to the length of the object", function () {
  return expect(slice({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, 1)).toEqual({ b: 2, c: 3, d: 4, e: 5, f: 6 });
});

test("from should default to zero", function () {
  return expect(slice({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });
});