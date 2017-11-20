import
  { map
  , concat
  , show
  } from "../../.."
  
test("it should return a function that is the composition of it self an another function", () => {
  const f = x => concat(x, "!")
  const g = x => show(x)
  const x = 2
  
  expect(map(f, g)(x)).toBe("2!")
  expect(map(f, g)(x)).toBe(f(g(x)))
})