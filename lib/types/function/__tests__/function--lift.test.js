import { Maybe, Result, Task, show, lift, ap, map } from "../../..";

test("it lifts a regular function into the context of array's", function () {
  expect(lift(function (a, b) {
    return a + b;
  }, [1, 2], [3])).toEqual([4, 5]);
  expect(lift(function (a, b) {
    return a + b;
  }, [1, 2], [])).toEqual([]);
  expect(lift(function (a, b) {
    return a + b;
  }, [], [])).toEqual([]);
});

test("it lifts a regular function into the context of maybe's", function () {
  expect(show(lift(function (a, b) {
    return a + b;
  }, Maybe.Some(2), Maybe.Some(3)))).toBe("Maybe.Some(5)");

  expect(show(lift(function (a, b) {
    return a + b;
  }, Maybe.Some(2), Maybe.None()))).toBe("Maybe.None()");

  expect(show(lift(function (a, b) {
    return a + b;
  }, Maybe.None(), Maybe.None()))).toBe("Maybe.None()");
});

test("it lifts a regular function into the context of result's", function () {
  expect(show(lift(function (a, b) {
    return a + b;
  }, Result.Ok(2), Result.Ok(3)))).toBe("Result.Ok(5)");

  expect(show(lift(function (a, b) {
    return a + b;
  }, Result.Ok(2), Result.Err("bar")))).toBe("Result.Err(\"bar\")");

  expect(show(lift(function (a, b) {
    return a + b;
  }, Result.Err("foo"), Result.Err("bar")))).toBe("Result.Err(\"foo\")");
});

test("it lifts a regular function into the context of tasks's", function (done) {
  lift(function (a, b) {
    return a + b;
  }, Task.of(2), Task.of(3)).fork(function (err) {}, function (val) {
    expect(val).toBe(5);
    done();
  });

  lift(function (a, b) {
    return a + b;
  }, Task.of(2), Task.fail(3)).fork(function (err) {
    expect(err).toBe(3);
    done();
  }, function () {});

  lift(function (a, b) {
    return a + b;
  }, Task.fail(2), Task.fail(3)).fork(function (err) {
    expect(err).toBe(2);
    done();
  }, function () {});
});