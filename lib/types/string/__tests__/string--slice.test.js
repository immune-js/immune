import { slice } from "../../..";

test("it should return a new string of all the characters in the original that exsists within the specified range (inclusive)", function () {
  return expect(slice("barbaz", 1, 4)).toEqual("arb");
});

test("to should default to the length of the string", function () {
  return expect(slice("barbaz", 1)).toEqual("arbaz");
});

test("from should default to zero", function () {
  return expect(slice("barbaz")).toEqual("barbaz");
});