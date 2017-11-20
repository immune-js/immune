import { show } from '../../../';

test("it returns a qouted string representation of strings", function () {
  expect(show("foo")).toBe('"foo"');
});