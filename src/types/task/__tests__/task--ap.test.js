import
  { Task
  , map
  , ap
  } from "../../.."


test("it applies the value inside of one task to a function inside of another", done =>
  ap(map(Task.of(2), x => y => x + y), Task.of(4)).fork(() => {}, x => {
    expect(x).toBe(6)
    done()
  })
)