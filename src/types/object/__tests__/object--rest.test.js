import
  { Some
  , None
  , rest
  , equals
  } from '../../..'

test("it returns an empty key/value pair when called on an empty object", () => {
  expect(rest({})).toEqual({})
})

test("it returns an empty key/value pair when called on an object with one key/value pair", () => {
  expect(rest({ x: 1 })).toEqual({})
})

test("it returns an object containing all but the first key/value pair when called on an object with multiple key/value pairs", () => {
  expect(rest({ x: 1, y: 2, z: 3 })).toEqual({ y: 2, z: 3 })
})