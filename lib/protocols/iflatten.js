import { Protocol } from "../utils/protocol";

export var IFlatten = Protocol("IFlatten", { flatten: [IFlatten, IFlatten]
});

export var flatten = IFlatten.flatten;