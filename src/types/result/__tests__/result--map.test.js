import
  { Ok
  , Err
  , map
  , caseOf
  , equals
  } from "../../../index"

test("it returns a new Ok containing the result of applying a function to the value of another Ok", () => {
  expect(
    equals(map(Ok(2), x => x + 1), Ok(3))
  ).toBe(true)
})

test("it is non-destructive", () => {
  let maybeTwo = Ok(2)
  
  map(maybeTwo, x => x + 1)
  
  expect(caseOf(maybeTwo, { _: _ => _ })).toBe(2)
})

test("it does nothing for Err", () => {
  expect(
    equals(map(Err("error!"), x => x + 1), Err("error!"))
  ).toBe(true)
})

test("it should curry the mapping function", () =>
  expect(caseOf(map(Ok(2), (x, y) => x + y),
    { Ok  : f   => f(4)
    , Err : err => err
    }
  )).toBe(6)
)