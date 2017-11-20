import { Union, caseOf, Any } from '../../../index';

test('caseOf should throw if not passed a pattern object', function () {
  var Result = Union('Result', { Ok: [Any], Err: [Any] });
  expect(function () {
    return caseOf(Result.Ok(2), null);
  }).toThrow('caseOf(pattern, ut) requires a pattern to match against');
  expect(function () {
    return caseOf(Result.Ok(2), Result.Ok(2));
  }).toThrow('caseOf(pattern, ut) requires a pattern to match against');
});

test('caseOf should throw if not passed a union type', function () {
  var Result = Union('Result', { Ok: [Any], Err: [Any] });
  expect(function () {
    return caseOf({}, {});
  }).toThrow('caseOf(pattern, ut) requires an instance of a union type to match on');
  expect(function () {
    return caseOf(null, {});
  }).toThrow('caseOf(pattern, ut) requires an instance of a union type to match on');
});

test('caseOf pattern matches over a union type', function () {
  var Result = Union('Result', { Ok: [Any], Err: [Any] });
  var ok = Result.Ok('that went well');
  var err = Result.Err('this, not so much');

  expect(caseOf(ok, { Ok: function Ok(x) {
      return x;
    }, Err: function Err(y) {
      return y;
    } })).toBe('that went well');
  expect(caseOf(err, { Ok: function Ok(x) {
      return x;
    }, Err: function Err(y) {
      return y;
    } })).toBe('this, not so much');
});

test('caseOf should allow wildcard matching', function () {
  var Result = Union('Result', { Ok: [Any], Err: [Any], Pending: [String] });
  var ok = Result.Ok('that went well');
  var err = Result.Err('this, not so much');
  var pending = Result.Pending('pending');

  expect(caseOf(ok, { Ok: function Ok(x) {
      return x;
    }, _: function _(y) {
      return y;
    } })).toBe('that went well');
  expect(caseOf(err, { Ok: function Ok(x) {
      return x;
    }, _: function _(y) {
      return y;
    } })).toBe('this, not so much');
  expect(caseOf(pending, { Ok: function Ok(x) {
      return x;
    }, _: function _(y) {
      return y;
    } })).toBe('pending');
});

test('caseOf should throw if pattern is not exhaustive', function () {
  var Result = Union('Result', { Ok: [Any], Err: [Any] });
  var ok = Result.Ok('that went well');
  var err = Result.Err('this, not so much');

  expect(function () {
    return caseOf(ok, { Ok: function Ok(x) {
        return x;
      } });
  }).toThrow('Non-exhaustive pattern provided for union type Result');
  expect(function () {
    return caseOf(err, { Ok: function Ok(x) {
        return x;
      } });
  }).toThrow('Non-exhaustive pattern provided for union type Result');

  expect(caseOf(ok, { _: function _(x) {
      return x;
    } })).toBe('that went well');
});