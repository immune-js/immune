import
  { conj
  } from "../../.."

test("given an array containing a key/value pair it should return a new object with the value associated with the key", () => {
  expect(conj({ a: 1 }, ["b", 2])).toEqual({ a: 1, b: 2 })
})

test("given multiple array's of key/value pairs it should return a new object with the value associated with the key", () => {
  expect(conj({ a: 1 }, ["b", 2], ["c", 3], ["d", 4])).toEqual({ a: 1, b: 2, c: 3, d: 4 })
})

test("given an object it should merge with the original object", () => {
  expect(conj({ a: 1 }, { b: 2, c: 3, d: 4 })).toEqual({ a: 1, b: 2, c: 3, d: 4 })
})

test("given multiple objects it should merge all of them with the original object", () => {
  expect(conj({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 })).toEqual({ a: 1, b: 2, c: 3, d: 4 })
})

test("when given duplicate keys the latest one should override previous ones", () => {
  expect(conj({ a: 1 }, [ "b", 2 ], [ "c", 3 ], [ "b", 4 ])).toEqual({ a: 1, b: 4, c: 3 })
  expect(conj({ a: 1 }, {  b : 2 }, {  c : 3 }, {  b : 4 })).toEqual({ a: 1, b: 4, c: 3 })
})