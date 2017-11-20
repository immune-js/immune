import { Protocol } from "../utils/protocol";

import { Any } from "../types/any/any";

import { OneOf } from "../types/one-of";

export var IAssociative = Protocol("IAssociative", { get: [IAssociative, OneOf(String, Number)],
  assoc: [IAssociative, OneOf(String, Number), Any],
  keys: [IAssociative],
  vals: [IAssociative]
});

export var get = IAssociative.get;
export var assoc = IAssociative.assoc;
export var keys = IAssociative.keys;
export var vals = IAssociative.vals;