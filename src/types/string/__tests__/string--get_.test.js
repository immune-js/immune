import
  { get_
  } from '../../../index'

test("it should return the value unwrapped when a character exists at the specified index", () => {
  expect(get_("bazquux", 0)).toBe("b")
})

test("it should return undefined when the index is out of range", () => {
  expect(get_("foo", 10)).toBe(undefined)
})