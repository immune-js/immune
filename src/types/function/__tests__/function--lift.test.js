import
  { Maybe
  , Result
  , Task
  , show
  , lift
  , ap
  , map
  } from "../../.."

test("it lifts a regular function into the context of array's", () => {
  expect(lift((a, b) => a + b, [1, 2], [3])).toEqual([4, 5])
  expect(lift((a, b) => a + b, [1, 2], [])).toEqual([])
  expect(lift((a, b) => a + b, [], [])).toEqual([])
})

test("it lifts a regular function into the context of maybe's", () => {
  expect(show(
    lift((a, b) => a + b, Maybe.Some(2), Maybe.Some(3))
  )).toBe("Maybe.Some(5)")
  
  expect(show(
    lift((a, b) => a + b, Maybe.Some(2), Maybe.None())
  )).toBe("Maybe.None()")
  
  expect(show(
    lift((a, b) => a + b, Maybe.None(), Maybe.None())
  )).toBe("Maybe.None()")
})

test("it lifts a regular function into the context of result's", () => {
  expect(show(
    lift((a, b) => a + b, Result.Ok(2), Result.Ok(3))
  )).toBe("Result.Ok(5)")
  
  expect(show(
    lift((a, b) => a + b, Result.Ok(2), Result.Err("bar"))
  )).toBe("Result.Err(\"bar\")")
  
  expect(show(
    lift((a, b) => a + b, Result.Err("foo"), Result.Err("bar"))
  )).toBe("Result.Err(\"foo\")")
})


test("it lifts a regular function into the context of tasks's", done => {
  lift((a, b) => a + b, Task.of(2), Task.of(3)).fork(err => {}, val => {
    expect(val).toBe(5)
    done()
  })
  
  lift((a, b) => a + b, Task.of(2), Task.fail(3)).fork(err => {
    expect(err).toBe(3)
    done()
  }, () => {})
  
  lift((a, b) => a + b, Task.fail(2), Task.fail(3)).fork(err => {
    expect(err).toBe(2)
    done()
  }, () => {})
})