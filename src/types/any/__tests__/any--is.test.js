const
  { Any
  , IShow
  , Union
  , OneOf
  , is
  } = require("../../../index.js")

test("it should typecheck union type instances", () => {
  const Option = Union("Option", { Some: [Any], None: [] })

  expect(is(Option.Some("foo")        , Option(String))).toBe(true)
  expect(is(Option.Some(2)            , Option(String))).toBe(false)
  expect(is(Option.None()             , Option(String))).toBe(true)
  
  const Res = Union("Res", { Ok: [Any], Err: [Any] })
  
  expect(is(Res.Ok("foo")             , Res(String, Number))).toBe(true)
  expect(is(Res.Ok(2)                 , Res(String, Number))).toBe(false)
  expect(is(Res.Err(2)                , Res(String, Number))).toBe(true)
  expect(is(Res.Err("foo")            , Res(String, Number))).toBe(false)
  
  const Multi = Union("Multi", { A: [Any, Any], B: [Any], C: [Any, Any, Any] })
  
  expect(is(Multi.A("foo", 34)        , Multi(String, Number, Boolean, Number, String, RegExp))).toBe(true)
  expect(is(Multi.A(34, "foo")        , Multi(String, Number, Boolean, Number, String, RegExp))).toBe(false)
  expect(is(Multi.B(true)             , Multi(String, Number, Boolean, Number, String, RegExp))).toBe(true)
  expect(is(Multi.B("foo")            , Multi(String, Number, Boolean, Number, String, RegExp))).toBe(false)
  expect(is(Multi.C(23, "foo", /bar/) , Multi(String, Number, Boolean, Number, String, RegExp))).toBe(true)
  expect(is(Multi.C("foo", /bar/, 23) , Multi(String, Number, Boolean, Number, String, RegExp))).toBe(false)
})

test('it should type check object shapes', () => {
  expect(is({ a: 1, b: "foo", c: /abc/ }, { a: Number, b: String, c: RegExp })).toBe(true)
  expect(is({ a: 'foo', b: /abc/, c: 1 }, { a: Number, b: String, c: RegExp })).toBe(false)
})

test("it should only typecheck keys present in the type-shape", () => {
  expect(is({ a: 1, b: "foo", c: /abc/, d: 234 }, { a: Number, b: String, c: RegExp })).toBe(true)
})

test("it should check array shapes", () => {
  expect(is( [ 11, 2, 3  ] , [ Number         ] )).toBe(true)
  expect(is( [ 1, 2, 3   ] , [ String         ] )).toBe(false)
  expect(is( [ [1, 2, 3] ] , [ [Number]       ] )).toBe(true)
  expect(is( [ 1, 2, 3   ] , [ [Number]       ] )).toBe(false)
  
  expect(is( [ 1, '2'    ] , [ Number, String ] )).toBe(false)
})

test("it should dispatch to the ITypeCheck.typeCheck if the type implements it", () => {
  expect(is("foo", OneOf(String, Number))).toBe(true)
  expect(is(12345, OneOf(String, Number))).toBe(true)
  
  expect(is(/123/, OneOf(String, Number))).toBe(false)
  expect(is([123], OneOf(String, Number))).toBe(false)
})