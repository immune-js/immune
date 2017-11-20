import { map } from '../../../';

test("it produce a new string with the result of applying a function to each character", function () {
  expect(map("foo", function (x) {
    return x.toUpperCase() + '!';
  })).toBe("F!O!O!");
});