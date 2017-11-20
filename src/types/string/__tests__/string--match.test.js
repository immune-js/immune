import
  { match
  , show
  } from "../../.."

test("it should return a Some with a list of matches if one or more matches was found", () => {
  expect(show(match("foobar", "bar"))).toBe('Maybe.Some([ "bar" ])')
  expect(show(match("foobar", /o/)  )).toBe('Maybe.Some([ "o" ])')
  expect(show(match("foobar", /o+/) )).toBe('Maybe.Some([ "oo" ])')
  expect(show(match("foobar", /o/g) )).toBe('Maybe.Some([ "o", "o" ])')
})

test("it should return None if no match was found", () => {
  expect(show(match("foobar", "z")  )).toBe('Maybe.None()')
  expect(show(match("foobar", /z/)  )).toBe('Maybe.None()')
  expect(show(match("foobar", /z+/) )).toBe('Maybe.None()')
  expect(show(match("foobar", /z/g) )).toBe('Maybe.None()')
})