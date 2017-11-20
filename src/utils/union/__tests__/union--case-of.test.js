import
  { Union
  , caseOf
  , Any
  } from '../../../index'

test('caseOf should throw if not passed a pattern object', () => {
  const Result = Union('Result', { Ok: [Any], Err: [Any] })
  expect(() => caseOf(Result.Ok(2), null)).toThrow('caseOf(pattern, ut) requires a pattern to match against')
  expect(() => caseOf(Result.Ok(2), Result.Ok(2))).toThrow('caseOf(pattern, ut) requires a pattern to match against')
})

test('caseOf should throw if not passed a union type', () => {
  const Result = Union('Result', { Ok: [Any], Err: [Any] })
  expect(() => caseOf({  }, {})).toThrow('caseOf(pattern, ut) requires an instance of a union type to match on')
  expect(() => caseOf(null, {})).toThrow('caseOf(pattern, ut) requires an instance of a union type to match on')
})

test('caseOf pattern matches over a union type', () => {
  const Result = Union('Result', { Ok: [Any], Err: [Any] })
  const ok     = Result.Ok  ( 'that went well'    )
  const err    = Result.Err ( 'this, not so much' )
  
  expect(caseOf( ok  , { Ok: x => x, Err: y => y } )).toBe( 'that went well'    )
  expect(caseOf( err , { Ok: x => x, Err: y => y } )).toBe( 'this, not so much' )
})

test('caseOf should allow wildcard matching', () => {
  const Result  = Union('Result', { Ok: [Any], Err: [Any], Pending: [String] })
  const ok      = Result.Ok      ( 'that went well'    )
  const err     = Result.Err     ( 'this, not so much' )
  const pending = Result.Pending ( 'pending'           )
  
  
  expect(caseOf( ok      , { Ok: x => x, _: y => y } )).toBe( 'that went well'    )
  expect(caseOf( err     , { Ok: x => x, _: y => y } )).toBe( 'this, not so much' )
  expect(caseOf( pending , { Ok: x => x, _: y => y } )).toBe( 'pending'           )
})

test('caseOf should throw if pattern is not exhaustive', () => {
  const Result  = Union('Result', { Ok: [Any], Err: [Any] })
  const ok      = Result.Ok  ( 'that went well'    )
  const err     = Result.Err ( 'this, not so much' )
  
  expect( () => caseOf( ok  , { Ok: x => x } )).toThrow('Non-exhaustive pattern provided for union type Result')
  expect( () => caseOf( err , { Ok: x => x } )).toThrow('Non-exhaustive pattern provided for union type Result')
  
  expect(caseOf(ok, { _: x => x })).toBe('that went well')
})
