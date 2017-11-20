import { Any } from "../types/any/any";

import { Protocol } from "../utils/protocol";

export var IEqual = Protocol("IEqual", { equals: [IEqual, Any]
});

IEqual(Any, { equals: function equals(self, other) {
    return self === other;
  }
});

export var equals = IEqual.equals;