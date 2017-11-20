import { Task, Stream, getIn, fold } from "../..";

import AppState from "../../ui/app-state";

export var read = function read() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return Task(function (fail, succeed) {
    return fold(getIn(AppState.state, path), succeed, fail);
  });
};

export var stream = function (unlisten) {
  return Stream.createWithMemory({ start: function start(listener) {
      return unlisten = AppState.subscribe(function (state) {
        return listener.next(state);
      });
    },
    stop: unlisten
  });
}(undefined);

export default { read: read, stream: stream };