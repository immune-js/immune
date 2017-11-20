import
  { Some
  , None
  , butLast
  , equals
  } from '../../..'

test("it returns an empty key/value pair when called on an empty object", () => {
  expect(butLast({})).toEqual({})
})

test("it returns an empty key/value pair when called on an object with one key/value pair", () => {
  expect(butLast({ x: 1 })).toEqual({})
})

test("it returns an object containing all but the last key/value pair when called on an object with multiple key/value pairs", () => {
  expect(butLast({ x: 1, y: 2, z: 3 })).toEqual({ x: 1, y: 2 })
})