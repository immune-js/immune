import { tryCatch } from "../../..";

test("it returns the result of the 'try' function if it doesn't throw an exception", function () {
  expect(tryCatch(function () {
    return 1 + 1;
  }, function (err) {
    return err.toString();
  })).toEqual(2);
});

test("it returns the result of the 'err' function if the 'try' function throws an exception", function () {
  expect(tryCatch(function () {
    throw new Error("error");
  }, function (err) {
    return err.toString();
  })).toEqual("Error: error");
});