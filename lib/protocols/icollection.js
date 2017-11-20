import { Protocol } from "../utils/protocol";

export var ICollection = Protocol("ICollection", { first: [ICollection],
  rest: [ICollection],
  conj: [ICollection]
});

export var first = ICollection.first;
export var rest = ICollection.rest;
export var conj = ICollection.conj;