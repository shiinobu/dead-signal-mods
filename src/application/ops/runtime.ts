import {
    OpsCommandRegistry,
} from "./command-registry.js";
import {
    ReconService,
    type ReconObserver,
    type ReconProgress,
    type ReconResult,
} from "./recon-service.js";
import {
    OpsSessionStore,
} from "./session-store.js";
import {
    OpsToolRegistry,
} from "./tool-registry.js";

export interface OpsRuntimeServices {
    readonly commands: OpsCommandRegistry;
    readonly recon: ReconService;
    readonly session: OpsSessionStore;
    readonly tools: OpsToolRegistry;
}

export class OpsRuntime {
    readonly commands: OpsCommandRegistry;
    readonly recon: ReconService;
    readonly session: OpsSessionStore;
    readonly tools: OpsToolRegistry;

    constructor(services?: Partial<OpsRuntimeServices>) {
        this.commands = services?.commands ?? new OpsCommandRegistry();
        this.recon = services?.recon ?? new ReconService();
        this.session = services?.session ?? new OpsSessionStore();
        this.tools = services?.tools ?? new OpsToolRegistry();
    }

    async runRecon(
        rawTarget: string,
        observer: ReconObserver,
    ): Promise<ReconResult | null> {
        return this.recon.run(rawTarget, {
            ...observer,
            onStarted: (event) => {
                this.session.startRecon(
                    event.profileId,
                    event.target,
                    event.totalSources,
                );
                observer.onStarted(event);
            },
            onSourceStarted: (event: ReconProgress) => {
                this.session.applySourceProgress(event, false);
                observer.onSourceStarted(event);
            },
            onSourceCompleted: (event: ReconProgress) => {
                this.session.applySourceProgress(event, true);
                observer.onSourceCompleted(event);
            },
            onHostDiscovered: (host: string) => {
                this.session.addHost(host);
                observer.onHostDiscovered(host);
            },
            onCompleted: (result: ReconResult) => {
                this.session.completeRecon(result);
                observer.onCompleted(result);
            },
        });
    }
}

export const opsRuntime = new OpsRuntime();
