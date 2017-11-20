import { Type } from "../../utils/type";

import { caseOf } from "../../utils/union";

import { augments } from "../../utils/protocol";

import { IFunctor, IApply, IBind, IAssociative, IIndexed, IKeyed, ICollection, IFlatten, IMonoid, IEqual, ITypeCheck, IShow } from "../../protocols";

import { Any, is } from "../any";

import { Null } from "../null";

import { OneOf } from "../one-of";

import { Maybe, maybe, getOrElse } from "../maybe";

import { getIn, assocIn } from "../collection";

export var Cursor = Type("Cursor", { coll: Any,
  path: [OneOf(String, Number)]
});

export var cursor = function cursor(coll) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var nextPath = coll instanceof Cursor ? coll.path.concat(path) : path;
  var nextColl = coll instanceof Cursor ? coll.coll : coll;

  return augments(nextColl, IAssociative) ? caseOf(getIn(nextColl, path), { Some: function Some(val) {
      return augments(val, IAssociative) && typeof val !== "string" ? Cursor(val, nextPath) : val;
    },
    None: function None() {
      return Cursor(Null, nextPath);
    }
  }) : nextColl;
};

IFunctor(Cursor, { map: function map(self, f) {
    return IFunctor.map(self.coll, f);
  }
});

IAssociative(Cursor, { get: function get(self, k, defaultValue) {
    return IAssociative.get(self.coll, k, defaultValue);
  },

  assoc: function assoc(self, k, v) {
    return IAssociative.assoc(self.coll, k, v);
  },

  keys: function keys(self) {
    return IAssociative.keys(self.coll);
  },

  vals: function vals(self) {
    return IAssociative.vals(self.coll);
  }
});

ICollection(Cursor, { first: function first(self) {
    return IFunctor.map(ICollection.first(self.coll), function (coll) {
      return coll;
    });
  },

  rest: function rest(self) {
    return ICollection.rest(self.coll);
  },

  conj: function conj(self, x) {
    return ICollection.conj(self.coll, x);
  }
});

IIndexed(Cursor, { nth: function nth(self, idx) {
    return IFunctor.map(IIndexed.nth(self.coll, idx), function (coll) {
      return coll;
    });
  }
});

IKeyed(Cursor, { dissoc: function dissoc(self, key) {
    return IKeyed.dissoc(self.coll, key);
  }
});

IFlatten(Cursor, { flatten: function flatten(self) {
    return IFlatten.flatten(self.coll);
  }
});

IMonoid(Cursor, { empty: function empty(self) {
    return IMonoid.empty(self.coll);
  },

  concat: function concat(self, other) {
    return IMonoid.concat(self.coll, other);
  }
});

IEqual(Cursor, { equals: function equals(self, other) {
    return other instanceof Cursor ? IEqual.equals(self.coll, other.coll) : IEqual.equals(self.coll, other);
  }
});

IApply(Cursor, { ap: function ap(self, other) {
    return IApply.ap(self.coll, other);
  }
});

IBind(Cursor, { andThen: function andThen(self, other) {
    return IBind.andThen(self.coll, other);
  }
});

ITypeCheck(Cursor, { typeCheck: function typeCheck(self, T) {
    return is(self.coll, T);
  }
});

IShow(Cursor, { show: function show(self) {
    return self.coll ? IShow.show(self.coll) : self.toString();
  }
});