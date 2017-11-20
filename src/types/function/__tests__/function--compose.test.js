import
  { compose
  } from "../../.."
  

test("it should return a new function that is the composition of multiple fns", () => {
  const f = x => x.concat(5)
  const g = x => x.concat(4)
  const y = (x, y, z) => [x, y, z]
  
  expect(compose(f, g, y)(1, 2, 3)).toEqual(f(g(y(1, 2, 3))))
  expect(compose(f, g, y)(1, 2, 3)).toEqual([1, 2, 3, 4, 5])
})