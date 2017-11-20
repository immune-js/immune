/*
 * Any
 * 
 * A type that represents any type
 *
 */

import { IMMUNE_IS_ANY_SYM } from "../../symbols";

export var Any = new function Any() {}();
Any[IMMUNE_IS_ANY_SYM] = true;
Any.toString = function () {
  return "Any";
};