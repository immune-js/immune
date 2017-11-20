import
  { Some
  , None
  , butLast
  , equals
  } from '../../..'

test("it returns an empty string when called on an empty string", () => {
  expect(butLast("")).toEqual("")
})

test("it returns an empty string when called on a string with one character", () => {
  expect(butLast("a")).toEqual("")
})

test("it returns an string containing all but the last element when called on a string with multiple characters", () => {
  expect(butLast("foobar")).toEqual("fooba")
})