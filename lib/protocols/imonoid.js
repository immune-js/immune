import { Protocol } from "../utils/protocol";

export var IMonoid = Protocol("IMonoid", { empty: [IMonoid],
  concat: [IMonoid, IMonoid]
});

export var empty = IMonoid.empty;
export var concat = IMonoid.concat;