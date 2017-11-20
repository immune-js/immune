import Window from "../";

test("payload should be an instance of Window", function (done) {
  Window.getWindow(function (win) {
    return win;
  }).fork(function () {}, function (win) {
    expect(win instanceof Window).toBe(true);
    done();
  });
});

test("payload should contain window dimensions", function (done) {
  updateWindowProps();
  Window.getWindow(function (win) {
    return win;
  }).fork(function () {}, function (win) {
    expect(win.dimensions).toEqual({ inner: { width: 1920, height: 1024 }, outer: { width: 1920, height: 1024 } });
    resetWindowProps();
    done();
  });
});

test("payload should contain scroll dimensions", function (done) {
  updateWindowProps();
  Window.getWindow(function (win) {
    return win;
  }).fork(function () {}, function (win) {
    expect(win.scroll).toEqual({ x: 20, y: 10 });
    resetWindowProps();
    done();
  });
});

//******************************************************************************
// UTILS
//******************************************************************************

var _window = window,
    innerHeight = _window.innerHeight,
    innerWidth = _window.innerWidth,
    outerHeight = _window.outerHeight,
    outerWidth = _window.outerWidth,
    scrollX = _window.scrollX,
    scrollY = _window.scrollY;


var updateWindowProps = function updateWindowProps() {
  window.innerHeight = 1024;window.innerWidth = 1920;
  window.outerHeight = 1024;window.outerWidth = 1920;
  window.scrollX = 20;window.scrollY = 10;
};

var resetWindowProps = function resetWindowProps() {
  window.innerHeight = innerHeight;window.innerWidth = innerWidth;
  window.outerHeight = outerHeight;window.outerWidth = outerWidth;
  window.scrollX = scrollX;window.scrollY = scrollY;
};