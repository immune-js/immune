var _require = require('../../../index.js'),
    IMMUNE_IS_ANY_SYM = _require.IMMUNE_IS_ANY_SYM,
    Any = _require.Any,
    is = _require.is,
    IShow = _require.IShow,
    Union = _require.Union;

test('Any defines isAny', function () {
  expect(Any[IMMUNE_IS_ANY_SYM]).toBe(true);
});

test('Any implements toString', function () {
  expect(Any.toString()).toBe('Any');
});