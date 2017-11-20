import { assocIn as _assocIn, dissocIn as _dissocIn } from "../";

import EJSON from "meteor-ejson";

export var AppState = { state: {},
  listeners: [],
  subscribe: function subscribe(listener) {
    return AppState.listeners.push(listener);
  },
  update: function update(f) {
    if (typeof APPLICATION_STATE !== "undefined") {
      AppState.state = EJSON.parse(APPLICATION_STATE.replace(/\n/g, "\\n"));
      APPLICATION_STATE = undefined;
    }

    AppState.state = f(AppState.state);

    requestAnimationFrame(function () {
      return AppState.listeners.forEach(function (f) {
        return f(AppState.state);
      });
    });
  },

  assocIn: function assocIn(path, nextState) {
    return AppState.update(function (appState) {
      return _assocIn(appState, path, nextState);
    });
  },

  dissocIn: function dissocIn(path) {
    return AppState.update(function (appState) {
      return _dissocIn(appState, path);
    });
  }
};

export default AppState;