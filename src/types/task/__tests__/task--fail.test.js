import
  { Task
  } from "../../.."


test('it creates a task that fails with value', done => {
  Task.fail(2).fork(err => {
    expect(err).toBe(2)
    done()
  }, () => {})
})