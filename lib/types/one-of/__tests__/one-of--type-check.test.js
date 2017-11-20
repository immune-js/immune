import { OneOf, ITypeCheck } from "../../../index";

test('it returns true if for values represented in the OneOf instance', function () {
  expect(ITypeCheck.typeCheck(OneOf(String, Number), "foo")).toBe(true);
  expect(ITypeCheck.typeCheck(OneOf(String, Number), 12345)).toBe(true);
});

test('it returns false for values not represented in the OneOf instance', function () {
  expect(ITypeCheck.typeCheck(OneOf(String, Number), /123/)).toBe(false);
  expect(ITypeCheck.typeCheck(OneOf(String, Number), [123])).toBe(false);
});