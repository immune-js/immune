import { getIn_ } from '../../../index';

test("it should return the value unwrapped when non-null value exists at the specified path", function () {
  expect(getIn_([[1, 2, 3]], [0, 1])).toBe(2);
});

test("it should return undefined when the path is out of range", function () {
  expect(getIn_([], [0, 1])).toBe(undefined);
});