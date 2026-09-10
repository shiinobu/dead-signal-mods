export interface DialogueHistoryEntry {
    readonly dialogueId: string;
    readonly nodeId: string;
}

export interface DialogueState {
    readonly activeDialogueId: string | null;
    readonly activeNodeId: string | null;
    readonly history: readonly DialogueHistoryEntry[];
}