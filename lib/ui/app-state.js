import { assocIn as _assocIn, dissocIn as _dissocIn } from "../";

import EJSON from "meteor-ejson";

var isUpdating = false;

export var AppState = { state: {} //typeof(APPLICATION_STATE) !== "undefined" ? EJSON.parse(APPLICATION_STATE) : {}
  , listeners: [],
  subscribe: function subscribe(listener) {
    return AppState.listeners.push(listener);
  },
  update: function update(f) {
    if (typeof APPLICATION_STATE !== "undefined") {
      AppState.state = EJSON.parse(APPLICATION_STATE.replace(/\n/g, "\\n"));
      APPLICATION_STATE = undefined;
      AppState.listeners.forEach(function (f) {
        return f(AppState.state);
      });
    }

    AppState.state = f(AppState.state);

    if (!isUpdating) {
      isUpdating = true;
      requestAnimationFrame(function () {
        AppState.listeners.forEach(function (f) {
          return f(AppState.state);
        });
        isUpdating = false;
      });
    }
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