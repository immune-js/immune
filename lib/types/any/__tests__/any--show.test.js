var _require = require('../../../index.js'),
    IShow = _require.IShow;

test('Any provides a default implementation for IShow.show by delegating to the toString method', function () {
  function Foo() {}
  Foo.prototype.toString = function () {
    return 'Hello from foo!';
  };

  expect(IShow.show(new Foo())).toBe('Hello from foo!');
});