import Time from "../"

test("it should pass an instance of Time to the provided callback", done => {
  Time.now(time => time).fork(() => {}, time => {
    expect(time instanceof Time).toBe(true)
    done()
  })
})

test("the time instance should contain the current hour", done => {
  Time.now(time => [time, new Date()]).fork(() => {}, ([time, currentDate]) => {
    expect(time.hour).toBe(currentDate.getHours())
    done()
  })
})

test("the time instance should contain the current minute", done => {
  Time.now(time => [time, new Date()]).fork(() => {}, ([time, currentDate]) => {
    expect(time.minute).toBe(currentDate.getMinutes())
    done()
  })
})

test("the time instance should contain the current second", done => {
  Time.now(time => [time, new Date()]).fork(() => {}, ([time, currentDate]) => {
    expect(time.second).toBe(currentDate.getSeconds())
    done()
  })
})

test("the time instance should contain the current millisecond", done => {
  Time.now(time => [time, new Date()]).fork(() => {}, ([time, currentDate]) => {
    expect(time.millisecond).toBe(currentDate.getMilliseconds())
    done()
  })
})