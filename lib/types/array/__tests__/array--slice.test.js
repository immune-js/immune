import { slice } from "../../..";

test("it should return a new array of all the values in the original that exsists within the specified range (inclusive)", function () {
  return expect(slice([1, 2, 3, 4, 5, 6], 1, 4)).toEqual([2, 3, 4]);
});

test("to should default to the length of the array", function () {
  return expect(slice([1, 2, 3, 4, 5, 6], 1)).toEqual([2, 3, 4, 5, 6]);
});

test("from should default to zero", function () {
  return expect(slice([1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
});