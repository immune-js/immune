import
  { Protocol
  , Any
  } from '../../../index'


test("it extends a type to an interface", () => {
  const IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] })
  const Type = function Type () {}
  
  IFoo(Type, { foo: (self, str, num) => str + num })
  
  expect(IFoo.foo(new Type(), 'foo', 3)).toBe('foo3')
})

test("it chooses implementation based on the type of the first argument", () => {
  const IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] })
  function Type1 () {}
  function Type2 () {}
  
  IFoo(Type1, { foo: (self, str, num) => str + num + '?' })
  IFoo(Type2, { foo: (self, str, num) => str + num + '!' })
  
  expect(IFoo.foo(new Type1(), 'foo', 3)).toBe('foo3?')
  expect(IFoo.foo(new Type2(), 'foo', 3)).toBe('foo3!')
})

test("it allows for default implementations by extending Any", () => {
  const IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] })
  function Type1 () {}
  function Type2 () {}
  
  IFoo(Any, { foo: (self, str, num) => str + num })
  
  expect(IFoo.foo(new Type1(), 'foo', 3)).toBe('foo3')
  expect(IFoo.foo(new Type2(), 'foo', 3)).toBe('foo3')
})

test("it still chooses the most specific implementation even when a default is provided", () => {
  const IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] })
  function Type1 () {}
  function Type2 () {}
  
  IFoo(Type1, { foo: (self, str, num) => str + num + '?' })
  IFoo(Any  , { foo: (self, str, num) => str + num + '*' })
  IFoo(Type2, { foo: (self, str, num) => str + num + '!' })
  
  expect(IFoo.foo(new Type1(), 'foo', 3)).toBe('foo3?')
  expect(IFoo.foo(123        , 'foo', 3)).toBe('foo3*')
  expect(IFoo.foo(new Type2(), 'foo', 3)).toBe('foo3!')
})