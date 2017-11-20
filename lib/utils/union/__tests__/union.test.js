import EJSON from 'meteor-ejson';

import { Union, Any, IMMUNE_TYPE_SYM, IMMUNE_ARGS_SYM } from '../../../index';

test('Union should throw if name is not provided', function () {
  expect(function () {
    return Union({});
  }).toThrow('Union requires a name parameter');
});

test('Union should throw if specification is not provided', function () {
  expect(function () {
    return Union('Maybe');
  }).toThrow('Union requires a specification');
});

test('Union creates one type constructor per case', function () {
  var Maybe = Union('Maybe', { Some: [Any], None: [] });
  expect(Maybe.Some(2)[IMMUNE_ARGS_SYM]).toEqual([2]);
  expect(Maybe.None()[IMMUNE_ARGS_SYM]).toEqual([]);
});

test('Union type constructors should typecheck arguments', function () {
  var Result = Union('Result', { Ok: [String], Err: [Number] });
  expect(function () {
    return Result.Ok(2);
  }).toThrow('The type of the arguments passed to type constructor Result.Ok(2) does not match the expected types');
  expect(function () {
    return Result.Err("2");
  }).toThrow('The type of the arguments passed to type constructor Result.Err("2") does not match the expected types');
});

test('Union type constructors should throw type error when to few arguments are provided', function () {
  var Result = Union('Result', { Ok: [String], Err: [Number] });
  expect(function () {
    return Result.Ok();
  }).toThrow('Too few arguments passed to type constructor Result.Ok()');
  expect(function () {
    return Result.Err();
  }).toThrow('Too few arguments passed to type constructor Result.Err()');
});

test('Union type constructor instances inherit from the union', function () {
  var Maybe = Union('Maybe', { Some: [Any], None: [] });
  expect(Maybe.Some(2) instanceof Maybe).toBe(true);
  expect(Maybe.None() instanceof Maybe).toBe(true);
});

test('Union type constructor instances inherit from their type constructor', function () {
  var Maybe = Union('Maybe', { Some: [Any], None: [] });
  expect(Maybe.Some(2) instanceof Maybe.Some).toBe(true);
  expect(Maybe.None() instanceof Maybe.None).toBe(true);
});

test('Union type constructor instances does not inherit from each other', function () {
  var Maybe = Union('Maybe', { Some: [Any], None: [] });
  expect(Maybe.Some(2) instanceof Maybe.None).toBe(false);
  expect(Maybe.None() instanceof Maybe.Some).toBe(false);
});

test('Union type constructor instances inherit from UnionType', function () {
  var Maybe = Union('Maybe', { Some: [Any], None: [] });
  expect(Maybe.Some(2) instanceof Union).toBe(true);
  expect(Maybe.None() instanceof Union).toBe(true);
});

test('Union type has a pointer to UnionType', function () {
  var Maybe = Union('Maybe', { Some: [Any], None: [] });
  expect(Maybe[IMMUNE_TYPE_SYM]).toBe(Union);
});

test('Union should allow recursive types', function () {
  var List = Union('List', { Cons: [Any, List], Nil: [] });
  expect(List.Cons(2, List.Nil()).toString()).toEqual("List.Cons(2, List.Nil())");
});

test('Union types should be serializable', function () {
  var Maybe = Union('Maybe', { Some: [Any], None: [] });
  expect(Maybe.Some(2).toJSONValue()).toEqual({ args: [2], type: 'Some' });
});

test('Union types are de-serializable', function () {
  var Maybe = Union('_Maybe', { Some: [Any], None: [] });

  var some = EJSON.parse(EJSON.stringify(Maybe.Some(2)));
  var none = EJSON.parse(EJSON.stringify(Maybe.None()));

  expect(some instanceof Maybe.Some).toEqual(true);
  expect(some.caseOf({ _: function _(x) {
      return x;
    } })).toEqual(2);
  expect(none instanceof Maybe.None).toEqual(true);
  expect(none.caseOf({ _: function _() {
      return 'err';
    } })).toEqual('err');
});