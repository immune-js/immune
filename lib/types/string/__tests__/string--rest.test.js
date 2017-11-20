import { Some, None, rest, equals } from '../../..';

test("it returns an empty string when called on an empty string", function () {
  expect(rest("")).toEqual("");
});

test("it returns an empty string when called on a string with one character", function () {
  expect(rest("a")).toEqual("");
});

test("it returns an string containing all but the first element when called on a string with multiple characters", function () {
  expect(rest("foobar")).toEqual("oobar");
});