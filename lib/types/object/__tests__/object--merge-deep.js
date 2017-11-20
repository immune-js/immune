import { mergeDeep } from "../../../index";

test("it deeply merges two objects", function () {
  expect(mergeDeep({ a: { b: { c: 1 }, d: 2 }, e: 3 }, { a: { b: { f: 2 }, d: 3 }, e: { f: { g: 4 } }, h: 5 })).toEqual({ a: { b: { c: 1, f: 2 }, d: 3 }, e: { f: { g: 4 } }, h: 5 });
});

test("it is non-destructive", function () {
  var a = { a: { b: { c: 1 }, d: 2 }, e: 3 };
  var b = { a: { b: { f: 2 }, d: 3 }, e: { f: { g: 4 } }, h: 5 };
  mergeDeep(a, b);
  expect(a).toEqual(a);
  expect(b).toEqual(b);
});