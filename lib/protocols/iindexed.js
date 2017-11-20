import { Protocol } from "../utils/protocol";

import { OneOf } from "../types/one-of";

export var IIndexed = Protocol("IIndexed", { nth: [IIndexed, [OneOf(String, Number)]]
});

export var nth = IIndexed.nth;