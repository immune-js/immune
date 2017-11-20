var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Time from "../";

test("it should pass an instance of Time to the provided callback", function (done) {
  Time.now(function (time) {
    return time;
  }).fork(function () {}, function (time) {
    expect(time instanceof Time).toBe(true);
    done();
  });
});

test("the time instance should contain the current hour", function (done) {
  Time.now(function (time) {
    return [time, new Date()];
  }).fork(function () {}, function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        time = _ref2[0],
        currentDate = _ref2[1];

    expect(time.hour).toBe(currentDate.getHours());
    done();
  });
});

test("the time instance should contain the current minute", function (done) {
  Time.now(function (time) {
    return [time, new Date()];
  }).fork(function () {}, function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        time = _ref4[0],
        currentDate = _ref4[1];

    expect(time.minute).toBe(currentDate.getMinutes());
    done();
  });
});

test("the time instance should contain the current second", function (done) {
  Time.now(function (time) {
    return [time, new Date()];
  }).fork(function () {}, function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        time = _ref6[0],
        currentDate = _ref6[1];

    expect(time.second).toBe(currentDate.getSeconds());
    done();
  });
});

test("the time instance should contain the current millisecond", function (done) {
  Time.now(function (time) {
    return [time, new Date()];
  }).fork(function () {}, function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        time = _ref8[0],
        currentDate = _ref8[1];

    expect(time.millisecond).toBe(currentDate.getMilliseconds());
    done();
  });
});