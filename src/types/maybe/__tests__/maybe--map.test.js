import
  { Some
  , None
  , map
  , caseOf
  , equals
  } from "../../../index"

test("it returns a new Some containing the result of applying a function to the value of another Some", () => {
  expect(
    equals(map(Some(2), x => x + 1), Some(3))
  ).toBe(true)
})

test("it is non-destructive", () => {
  let maybeTwo = Some(2)
  
  map(maybeTwo, x => x + 1)
  
  expect(caseOf(maybeTwo, { _: _ => _ })).toBe(2)
})

test("it does nothing for None", () => {
  expect(
    equals(map(None(), x => x + 1), None())
  ).toBe(true)
})

test("it should curry the mapping function", () =>
  expect(caseOf(map(Some(2), (x, y) => x + y),
    { Some: f  => f(4)
    , None: () => 0
    }
  )).toBe(6)
)