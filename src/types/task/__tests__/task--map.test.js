import
  { Task
  , map
  } from "../../.."


test("it applies a transformation function to the value inside the task", done =>
  map(Task.of(2), x => x + 2).fork(() => {}, x => {
    expect(x).toBe(4)
    done()
  })
)

test("it curries the transformation function", done => {
  map(Task.of(2), (x, y) => x + y).fork(() => {}, f => {
    expect(f(4)).toBe(6)
    done()
  })
})