import
  { Task
  } from "../../.."


test("it creates a task that succeeds with value", done => {
  Task.succeed(2).fork(() => {}, x => {
    expect(x).toBe(2)
    done()
  })
})