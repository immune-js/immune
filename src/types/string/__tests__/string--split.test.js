import
  { split
  } from "../../.."

test("it should split a string based on a pattern", () => {
  expect(split( "abc"       , ""   )).toEqual([ "a"  , "b" , "c"])
  expect(split( "abcabc"    , "b"  )).toEqual([ "a"  , "ca", "c"])
  expect(split( "foobarbaz" , /ba/ )).toEqual([ "foo", "r" , "z"])
})