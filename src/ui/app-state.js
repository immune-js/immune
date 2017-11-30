import 
  { assocIn
  , dissocIn
  } from "../"

import EJSON from "meteor-ejson"

export const AppState = 
  { state     : {}
  , listeners : []
  , subscribe : listener => (AppState.listeners.push(listener))
  , update    : f => {
      if (typeof(APPLICATION_STATE) !== "undefined") {
        AppState.state    = EJSON.parse(APPLICATION_STATE.replace(/\n/g, "\\n"))
        APPLICATION_STATE = undefined
        AppState.listeners.forEach(f => f(AppState.state))
      }
      
      AppState.state = f(AppState.state)
      
      requestAnimationFrame(() => 
        AppState.listeners.forEach(f => f(AppState.state))
      )
    }
    
  , assocIn : (path, nextState) => 
      AppState.update(appState => assocIn(appState, path, nextState))
    
  , dissocIn : path =>
      AppState.update(appState => dissocIn(appState, path))
  }
  
export default AppState