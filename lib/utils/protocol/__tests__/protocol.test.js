import { Protocol, Any } from '../../../index';

test("it extends a type to an interface", function () {
  var IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] });
  var Type = function Type() {};

  IFoo(Type, { foo: function foo(self, str, num) {
      return str + num;
    } });

  expect(IFoo.foo(new Type(), 'foo', 3)).toBe('foo3');
});

test("it chooses implementation based on the type of the first argument", function () {
  var IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] });
  function Type1() {}
  function Type2() {}

  IFoo(Type1, { foo: function foo(self, str, num) {
      return str + num + '?';
    } });
  IFoo(Type2, { foo: function foo(self, str, num) {
      return str + num + '!';
    } });

  expect(IFoo.foo(new Type1(), 'foo', 3)).toBe('foo3?');
  expect(IFoo.foo(new Type2(), 'foo', 3)).toBe('foo3!');
});

test("it allows for default implementations by extending Any", function () {
  var IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] });
  function Type1() {}
  function Type2() {}

  IFoo(Any, { foo: function foo(self, str, num) {
      return str + num;
    } });

  expect(IFoo.foo(new Type1(), 'foo', 3)).toBe('foo3');
  expect(IFoo.foo(new Type2(), 'foo', 3)).toBe('foo3');
});

test("it still chooses the most specific implementation even when a default is provided", function () {
  var IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] });
  function Type1() {}
  function Type2() {}

  IFoo(Type1, { foo: function foo(self, str, num) {
      return str + num + '?';
    } });
  IFoo(Any, { foo: function foo(self, str, num) {
      return str + num + '*';
    } });
  IFoo(Type2, { foo: function foo(self, str, num) {
      return str + num + '!';
    } });

  expect(IFoo.foo(new Type1(), 'foo', 3)).toBe('foo3?');
  expect(IFoo.foo(123, 'foo', 3)).toBe('foo3*');
  expect(IFoo.foo(new Type2(), 'foo', 3)).toBe('foo3!');
});