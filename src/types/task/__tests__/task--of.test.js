import
  { Task
  } from "../../.."

test("it wraps a value in a task", done => 
  Task.of(2).fork(() => {}, x => {
    expect(x).toBe(2)
    done()
  })
)