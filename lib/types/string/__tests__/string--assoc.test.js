import { assoc } from '../../../index';

test("it should update an exisiting value", function () {
  expect(assoc("abc", 0, "x")).toEqual("xbc");
});

test("it should only update paths already in the string", function () {
  expect(assoc("abc", 3, "x")).toEqual("abc");
});