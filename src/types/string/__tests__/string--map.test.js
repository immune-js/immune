import
  { map
  } from '../../../'

test("it produce a new string with the result of applying a function to each character", () => {
  expect(map("foo", x => x.toUpperCase() + '!')).toBe("F!O!O!")
})