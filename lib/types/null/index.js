
/*
 * Null
 * 
 * A type that represents null and undefined to allow for protocol extensions
 *
 */

export var Null = new function Null() {}();
Null.toString = function () {
  return 'Null';
};