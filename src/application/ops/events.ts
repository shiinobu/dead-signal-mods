export const DSS_RECON_EVENTS = {
    started: "DSS.Recon.Started",
    sourceStarted: "DSS.Recon.SourceStarted",
    sourceCompleted: "DSS.Recon.SourceCompleted",
    hostDiscovered: "DSS.Recon.HostDiscovered",
    completed: "DSS.Recon.Completed",
    failed: "DSS.Recon.Failed",
} as const;

export const DSS_OPS_EVENTS = {
    recon: DSS_RECON_EVENTS,
} as const;
