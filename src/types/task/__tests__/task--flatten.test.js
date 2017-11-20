import
  { Task
  , flatten
  } from "../../.."


test("it unwraps a nested task", done =>
  flatten(Task.of(Task.of(2))).fork(() => {}, x => {
    expect(x).toBe(2)
    done()
  })
)