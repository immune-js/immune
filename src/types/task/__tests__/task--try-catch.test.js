import
  { Task
  } from "../../.."

test("it returns a successful task of the result of the 'try' function if it doesn't throw an exception", done => {
  Task.tryCatch(() => 1 + 1, err => err.toString()).fork(err => {}, val => {
    expect(val).toEqual(2)
    done()
  })
})

test("it returns the result of the 'err' function if the 'try' function throws an exception", done => {
  Task.tryCatch(() => { throw new Error("error") }, err => err.toString()).fork(
    err => {
      expect(err).toEqual("Error: error")
      done()
    },
    succees => {}
  )
})