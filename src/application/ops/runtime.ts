import {
    ReconService,
} from "./recon-service.js";
import {
    OpsSessionStore,
} from "./session-store.js";
import {
    OpsToolRegistry,
} from "./tool-registry.js";

export interface OpsRuntimeServices {
    readonly recon: ReconService;
    readonly session: OpsSessionStore;
    readonly tools: OpsToolRegistry;
}

export class OpsRuntime {
    readonly recon: ReconService;
    readonly session: OpsSessionStore;
    readonly tools: OpsToolRegistry;

    constructor(services?: Partial<OpsRuntimeServices>) {
        this.recon = services?.recon ?? new ReconService();
        this.session = services?.session ?? new OpsSessionStore();
        this.tools = services?.tools ?? new OpsToolRegistry();
    }
}

export const opsRuntime = new OpsRuntime();
