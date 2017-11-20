import { IShow, IFunctor, IAssociative, IIndexed, ICollection, IMonoid } from "../../protocols";

import { maybe, getOrElse } from "../maybe";

/*
 * Extends IFunctor to work over strings
 *
 * Example:
 *
 *   IFunctor.map("foo", x => x.toUpperCase + "!") //=> "F!O!O!"
 */

IFunctor(String, { map: function map(self, f) {
    var res = "";
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = self[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var ch = _step.value;

        res += f(ch);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return res;
  }
});

/*
 * Extends IAssociative to work over strings
 *
 * Example:
 *
 *   IAssociative.get("foo", 0)         // => Some("f")
 *   IAssociative.get("foo", 5)         // => None(   )
 *
 *   IAssociative.assoc("foo", 1, "l")  // => "flo"
 */

IAssociative(String, { get: function get(self, idx, defaultValue) {
    return defaultValue == null ? maybe(self[idx]) : getOrElse(maybe(self[idx]), defaultValue);
  },

  assoc: function assoc(self, idx, val) {
    return IAssociative.assoc(self.split(''), idx, val).join('');
  },

  keys: function keys(self) {
    return self.split('').map(function (_, i) {
      return i;
    });
  },

  vals: function vals(self) {
    return self.split('');
  }
});

/*
 * Extends IIndexed to work over strings
 *
 * Example:
 *
 *   IIndexed.nth("bar", 1) // => Some("a")
 *   IIndexed.nth("bar", 4) // => None
 *
 *   IIndexed.nth("bar", 1, "x") // => "a"
 *   IIndexed.nth("bar", 4, "x") // => "x"
 *
 */

IIndexed(String, { nth: function nth(self, key, defaultValue) {
    return defaultValue == null ? maybe(self[key]) : getOrElse(maybe(self[key]), defaultValue);
  }
});

/*
 * Extends ICollection to work over strings
 *
 * Example:
 *
 *   ICollection.first("foo")                 // => Some("f")
 *   ICollection.first("")                    // => None(   )
 *
 *   ICollection.rest("foobar")               // => "oobar"
 *   ICollection.rest("")                     // => ""
 *
 *   ICollection.conj("ba", "r")              // => "bar"
 *   ICollection.conj("foo", "b", "a", "r")  // => "foobar"
 *
 */

ICollection(String, { first: function first(self) {
    return maybe(self[0]);
  },

  rest: function rest(self) {
    return self.slice(1);
  },

  conj: function conj(self) {
    for (var _len = arguments.length, vals = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      vals[_key - 1] = arguments[_key];
    }

    return vals.reduce(function (acc, val) {
      return acc + val;
    }, self);
  }
});

/*
 * Extends IMonoid to work over strings
 *
 * Example:
 *
 *   IMonoid.empty("abc") //=> ""
 */

IMonoid(String, { empty: function empty(_) {
    return "";
  },

  concat: function concat(self) {
    for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    return rest.reduce(function (acc, str) {
      return acc + str;
    }, self);
  }
});

/*
 * Extends IShow to work over strings
 *
 * Example:
 *
 *   IShow.show("1") //=> '"1"'
 */

IShow(String, { show: function show(self) {
    return "\"" + self + "\"";
  }
});

/* Split a string based on a pattern
 *
 * Example:
 *
 *   split( "abc"       , ""   ) // => [ "a"  , "b" , "c"]
 *   split( "abcabc"    , "b"  ) // => [ "a"  , "ca", "c"]
 *   split( "foobarbaz" , /ba/ ) // => [ "foo", "r" , "z"]
 *
 */

export var split = function split(str, pattern) {
  return str.split(pattern);
};

/*
 * match(str: String, toMatch: OneOf(String, RegExp)) => Maybe([String])
 *
 * Tries to find an occurrence of characters in a string, returns either a 
 * Some containing a list of matches or None if no match was found
 *
 * Example:
 *
 *   match("foobar", "bar")  // => Some(["bar"])
 *   match("foobar", /o/)    // => Some(["o"])
 *   match("foobar", /o+/)   // => Some(["oo"])
 *   match("foobar", /o/g)   // => Some(["o", "o"])
 *
 *   match("foobar", "z")    //=> None()
 *   match("foobar", /z/)    //=> None()
 *   match("foobar", /z+/)   //=> None()
 *   match("foobar", /z/g)   //=> None()
 *
 */
export var match = function match(str, regex) {
  return maybe(str.match(regex));
};

/* startsWith(str: String, char: String) => Boolean
 * 
 * Check if a string starts with a particular character
 *
 * Example:
 *
 *   startsWith("abc", "a") // => true
 *   startsWith("abc", "b") // => false
 *
 */

export var startsWith = function startsWith(str, char) {
  return getOrElse(ICollection.first(str), false) === char;
};