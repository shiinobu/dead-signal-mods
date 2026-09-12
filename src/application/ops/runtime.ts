import {
    OpsCommandRegistry,
} from "./command-registry.js";
import {
    OpsEventBus,
} from "./event-bus.js";
import type {
    OpsEventMap,
} from "./event-types.js";
import {
    ReconService,
    type ReconObserver,
} from "./recon-service.js";
import type {
    ReconProgress,
    ReconResult,
} from "../../domain/recon/index.js";
import {
    OpsSessionStore,
} from "./session-store.js";
import {
    OpsToolRegistry,
} from "./tool-registry.js";

export interface OpsRuntimeServices {
    readonly commands: OpsCommandRegistry;
    readonly events: OpsEventBus<OpsEventMap>;
    readonly recon: ReconService;
    readonly session: OpsSessionStore;
    readonly tools: OpsToolRegistry;
}

export class OpsRuntime {
    readonly commands: OpsCommandRegistry;
    readonly events: OpsEventBus<OpsEventMap>;
    readonly recon: ReconService;
    readonly session: OpsSessionStore;
    readonly tools: OpsToolRegistry;

    constructor(services?: Partial<OpsRuntimeServices>) {
        this.commands = services?.commands ?? new OpsCommandRegistry();
        this.events = services?.events ?? new OpsEventBus<OpsEventMap>();
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
                this.events.emit("reconStarted", event);
                observer.onStarted(event);
            },
            onSourceStarted: (event: ReconProgress) => {
                this.session.applySourceProgress(event, false);
                this.events.emit("reconSourceStarted", event);
                observer.onSourceStarted(event);
            },
            onSourceCompleted: (event: ReconProgress) => {
                this.session.applySourceProgress(event, true);
                this.events.emit("reconSourceCompleted", event);
                observer.onSourceCompleted(event);
            },
            onHostDiscovered: (host: string) => {
                this.session.addHost(host);
                this.events.emit("reconHostDiscovered", { host });
                observer.onHostDiscovered(host);
            },
            onCompleted: (result: ReconResult) => {
                this.session.completeRecon(result);
                this.events.emit("reconCompleted", result);
                observer.onCompleted(result);
            },
        });
    }
}

export const opsRuntime = new OpsRuntime();
