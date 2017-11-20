import { Ok, Err, fold } from "../../../";

test("given a Ok it should apply the first function with the success value and return the result", function () {
  expect(fold(Ok(2), function (x) {
    return x + 2;
  }, function () {
    return -1;
  })).toEqual(4);
});

test("given a Ok and the first argument is not a function then just return the value", function () {
  expect(fold(Ok(2), 4, function (err) {
    return -1;
  })).toEqual(4);
});

test("given a Err it should apply the second function with the eroor value and return the result", function () {
  expect(fold(Err("no can do"), function (x) {
    return x + 2;
  }, function (err) {
    return err + "!!!";
  })).toEqual("no can do!!!");
});

test("given a Err and the second argument is not a function then just return the value", function () {
  expect(fold(Err(2), function (x) {
    return x + 2;
  }, -1)).toEqual(-1);
});