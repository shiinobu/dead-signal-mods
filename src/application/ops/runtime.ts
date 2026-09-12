import {
    ReconService,
} from "./recon-service.js";

export interface OpsRuntimeServices {
    readonly recon: ReconService;
}

export class OpsRuntime {
    readonly recon: ReconService;

    constructor(services?: OpsRuntimeServices) {
        const runtimeServices = services ?? {
            recon: new ReconService(),
        };

        this.recon = runtimeServices.recon;
    }
}

export const opsRuntime = new OpsRuntime();
