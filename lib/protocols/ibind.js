import { Protocol } from "../utils/protocol";

export var IBind = Protocol("IBind", { andThen: [IBind, Function]
});

export var andThen = IBind.andThen;