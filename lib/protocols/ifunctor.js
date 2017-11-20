import { Protocol } from "../utils/protocol";

export var IFunctor = Protocol("IFunctor", { map: [IFunctor, Function]
});

export var map = IFunctor.map;