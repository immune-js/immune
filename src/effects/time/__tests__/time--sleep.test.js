import Time from "../"

test("it should invoke a function after x milli seconds", done => {
  const startDate = new Date()
  Time.sleep(1000, () => new Date()).fork(done, endDate => {
    expect(startDate.getSeconds() + 1).toBe(endDate.getSeconds())
    done()
  })
})