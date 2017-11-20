import 
  { curry
  } from "../../../"

test("it returns a function that accepts all arguments at once", () => {
  expect(curry((x, y, z) => x + y + z)(1, 2, 3)).toBe(6)
})

test("it returns a function that accepts one argument at a time", () => {
  expect(curry((x, y, z) => x + y + z)(1)(2)(3)).toBe(6)
})

test("it returns a function that accepts multiple arguments at a time", () => {
  expect(curry((x, y, z) => x + y + z)(1, 2)(3)).toBe(6)
})

test("it should not curry an already curried function", () => {
  const f         = (x, y, z) => x + y + z
  const curriedF  = curry(f)
  const partialF1 = curriedF(1)
  const partialF2 = curriedF(1)(2)
  const partialF3 = curriedF(1, 2)
  
  expect(curry(f        )).not.toBe(f)
  expect(curry(curriedF )).toBe(curriedF)
  expect(curry(partialF1)).toBe(partialF1)
  expect(curry(partialF2)).toBe(partialF2)
  expect(curry(partialF3)).toBe(partialF3)
})