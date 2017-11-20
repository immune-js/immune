import
  { show
  } from '../../../'

test("it returns a qouted string representation of strings", () => {
  expect(show("foo")).toBe('"foo"')
})