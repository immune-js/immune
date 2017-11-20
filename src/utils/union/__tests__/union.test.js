import EJSON from 'meteor-ejson'

import
  { Union
  , Any
  , IMMUNE_TYPE_SYM
  , IMMUNE_ARGS_SYM
  } from '../../../index'

test('Union should throw if name is not provided', () => {
  expect(() => Union({})).toThrow('Union requires a name parameter')
})

test('Union should throw if specification is not provided', () => {
  expect(() => Union('Maybe')).toThrow('Union requires a specification')
})

test('Union creates one type constructor per case', () => {
  const Maybe = Union('Maybe', { Some: [Any], None: [] })
  expect(Maybe.Some(2)[IMMUNE_ARGS_SYM]).toEqual([2])
  expect(Maybe.None( )[IMMUNE_ARGS_SYM]).toEqual([])
})

test('Union type constructors should typecheck arguments', () => {
  const Result = Union('Result', { Ok: [String], Err : [Number] })
  expect(() => Result.Ok ( 2 )).toThrow('The type of the arguments passed to type constructor Result.Ok(2) does not match the expected types')
  expect(() => Result.Err("2")).toThrow('The type of the arguments passed to type constructor Result.Err("2") does not match the expected types')
})

test('Union type constructors should throw type error when to few arguments are provided', () => {
  const Result = Union('Result', { Ok: [String], Err : [Number] })
  expect(() => Result.Ok ()).toThrow('Too few arguments passed to type constructor Result.Ok()')
  expect(() => Result.Err()).toThrow('Too few arguments passed to type constructor Result.Err()')
})

test('Union type constructor instances inherit from the union', () => {
  const Maybe = Union('Maybe', { Some: [Any], None: [] })
  expect(Maybe.Some(2) instanceof Maybe).toBe(true)
  expect(Maybe.None( ) instanceof Maybe).toBe(true)
})

test('Union type constructor instances inherit from their type constructor', () => {
  const Maybe = Union('Maybe', { Some: [Any], None: [] })
  expect(Maybe.Some(2) instanceof Maybe.Some).toBe(true)
  expect(Maybe.None( ) instanceof Maybe.None).toBe(true)
})

test('Union type constructor instances does not inherit from each other', () => {
  const Maybe = Union('Maybe', { Some: [Any], None: [] })
  expect(Maybe.Some(2) instanceof Maybe.None).toBe(false)
  expect(Maybe.None( ) instanceof Maybe.Some).toBe(false)
})

test('Union type constructor instances inherit from UnionType', () => {
  const Maybe = Union('Maybe', { Some: [Any], None: [] })
  expect(Maybe.Some(2) instanceof Union).toBe(true)
  expect(Maybe.None( ) instanceof Union).toBe(true)
})

test('Union type has a pointer to UnionType', () => {
  const Maybe = Union('Maybe', { Some: [Any], None: [] })
  expect(Maybe[IMMUNE_TYPE_SYM]).toBe(Union)
})

test('Union should allow recursive types', () => {
  const List = Union('List', { Cons: [Any, List], Nil: [] })
  expect(List.Cons(2, List.Nil()).toString()).toEqual("List.Cons(2, List.Nil())")
})

test('Union types should be serializable', () => {
  const Maybe = Union('Maybe', { Some: [Any], None: [] })
  expect(Maybe.Some(2).toJSONValue()).toEqual({ args: [2], type: 'Some' })
})

test('Union types are de-serializable', () => {
  const Maybe = Union('_Maybe', { Some: [Any], None: [] })
  
  const some = EJSON.parse(EJSON.stringify(Maybe.Some(2)))
  const none = EJSON.parse(EJSON.stringify(Maybe.None()))

  expect(some instanceof Maybe.Some).toEqual(true)
  expect(some.caseOf({ _: x => x })).toEqual(2)
  expect(none instanceof Maybe.None).toEqual(true)
  expect(none.caseOf({ _: () => 'err' })).toEqual('err')
})