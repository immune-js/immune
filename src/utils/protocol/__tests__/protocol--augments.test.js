import
  { Protocol
  , Any
  , Null
  , augments
  } from '../../../index'


test("it returns true if a type implements a protocol", () => {
  const IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] })
  function Type1 () {}
  function Type2 () {}
  
  IFoo(Type1, { foo: (self, str, num) => str + num + '?' })
  
  expect(augments(Type1, IFoo)).toBe(true)
})

test('it returns true if a protocol specifies a default implementation', () => {
  const IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] })
  function Type1 () {}
  function Type2 () {}
  
  IFoo(Any, { foo: (self, str, num) => str + num + '?' })
  
  expect(augments(Type1, IFoo)).toBe(true)
  expect(augments(Type2, IFoo)).toBe(true)
})

test("it returns true if a type doesn't implement a protocol", () => {
  const IFoo = Protocol('IFoo', { foo: [IFoo, String, Number] })
  function Type1 () {}
  function Type2 () {}
  
  IFoo(Type1, { foo: (self, str, num) => str + num + '?' })
  
  expect(augments(Type2, IFoo)).toBe(false)
})

