import { Stream } from "../../";

export var eventStream = function eventStream(getEl, type, action) {
  var callback = void 0;
  return Stream.create({ start: function start(listener) {
      callback = function callback(evt) {
        return listener.next(action(evt));
      };
      getEl().addEventListener(type, callback);
    },
    stop: function stop() {
      return getEl().removeEventListener(type, callback);
    }
  });
};