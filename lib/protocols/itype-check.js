import { Protocol } from "../utils/protocol";

import { Any } from "../types/any/any";

export var ITypeCheck = Protocol("ITypeCheck", { typeCheck: [ITypeCheck, Any]
});

export var typeCheck = ITypeCheck.typeCheck;