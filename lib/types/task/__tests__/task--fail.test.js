import { Task } from "../../..";

test('it creates a task that fails with value', function (done) {
  Task.fail(2).fork(function (err) {
    expect(err).toBe(2);
    done();
  }, function () {});
});