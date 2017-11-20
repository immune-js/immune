import
  { Task
  , Result
  } from "../../.."


test("it creates a task that will always succeed but with different values", done => {
  Task.perform(Task.of(2), Result.Err, Result.Ok).fork(() => {}, msg => {
    expect(msg.toString()).toEqual('Result.Ok(2)')
    done()
  })

  Task.perform(Task.fail("error"), Result.Err, Result.Ok).fork(() => {}, msg => {
    expect(msg.toString()).toEqual('Result.Err("error")')
    done()
  })
})