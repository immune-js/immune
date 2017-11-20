import 
  { IShow
  , IFunctor
  , IAssociative
  , IIndexed
  , ICollection
  , IMonoid
  } from "../../protocols"

import
  { maybe
  , getOrElse
  } from "../maybe"

/*
 * Extends IFunctor to work over strings
 *
 * Example:
 *
 *   IFunctor.map("foo", x => x.toUpperCase + "!") //=> "F!O!O!"
 */

IFunctor(String,
  { map: (self, f) => {
      let res = ""
      for (const ch of self)
        res += f(ch)
      return res
    }
  }
)

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

IAssociative(String,
  { get: (self, idx, defaultValue) =>
      defaultValue == null ? maybe(self[idx]) : getOrElse(maybe(self[idx]), defaultValue)
  
  , assoc: (self, idx, val) =>
      IAssociative.assoc(self.split(''), idx, val).join('')
  
  , keys: self =>
      self.split('').map((_, i) => i)
  
  , vals: self =>
      self.split('')
  }
)

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

IIndexed(String,
  { nth: (self, key, defaultValue) => 
      defaultValue == null ? maybe(self[key]) : getOrElse(maybe(self[key]), defaultValue)
  }
)

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

ICollection(String,
  { first: self =>
      maybe(self[0])
      
  , rest: self =>
      self.slice(1)
  
  , conj: (self, ...vals) =>
      vals.reduce((acc, val) => acc + val, self)
  }
)

/*
 * Extends IMonoid to work over strings
 *
 * Example:
 *
 *   IMonoid.empty("abc") //=> ""
 */
 
IMonoid(String,
  { empty  : _ => ""
  
  , concat : (self, ...rest) => 
      rest.reduce((acc, str) => acc + str, self)
  }
)

/*
 * Extends IShow to work over strings
 *
 * Example:
 *
 *   IShow.show("1") //=> '"1"'
 */
 
IShow(String,
  { show: self => 
      `"${self}"`
  }
)

/* Split a string based on a pattern
 *
 * Example:
 *
 *   split( "abc"       , ""   ) // => [ "a"  , "b" , "c"]
 *   split( "abcabc"    , "b"  ) // => [ "a"  , "ca", "c"]
 *   split( "foobarbaz" , /ba/ ) // => [ "foo", "r" , "z"]
 *
 */

export const split = (str, pattern) =>
  str.split(pattern)

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
export const match = (str, regex) =>
  maybe(str.match(regex))

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

export const startsWith = (str, char) =>
  getOrElse(ICollection.first(str), false) === char