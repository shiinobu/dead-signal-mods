import type {
    DialogueHistoryEntry,
    DialogueState,
    NarrativeState,
} from "../domain/index.js";

import type {
    DomainStateAccess,
} from "../state/index.js";

export class NarrativeStateService {
    constructor(
        private readonly domainState: DomainStateAccess,
    ) {}

    getNarrativeState(): NarrativeState {
        return this.domainState.get().narrative;
    }

    setChapter(chapterId: string): void {
        this.domainState.update((current) => ({
            ...current,
            narrative: {
                ...current.narrative,
                chapterId,
                sceneId: null,
            },
        }));
    }

    setScene(sceneId: string): void {
        this.domainState.update((current) => ({
            ...current,
            narrative: {
                ...current.narrative,
                sceneId,
            },
        }));
    }

    completeChapter(chapterId: string): void {
        this.domainState.update((current) => {
            if (
                current.narrative.completedChapterIds.includes(
                    chapterId,
                )
            ) {
                return current;
            }

            return {
                ...current,
                narrative: {
                    ...current.narrative,
                    completedChapterIds: [
                        ...current.narrative.completedChapterIds,
                        chapterId,
                    ],
                },
            };
        });
    }

    getDialogueState(): DialogueState {
        return this.domainState.get().dialogue;
    }

    startDialogue(
        dialogueId: string,
        nodeId: string,
    ): void {
        this.domainState.update((current) => ({
            ...current,
            dialogue: {
                ...current.dialogue,
                activeDialogueId: dialogueId,
                activeNodeId: nodeId,
            },
        }));
    }

    advanceDialogue(nodeId: string): void {
        this.domainState.update((current) => {
            const dialogueId =
                current.dialogue.activeDialogueId;

            if (dialogueId === null) {
                return current;
            }

            const historyEntry: DialogueHistoryEntry = {
                dialogueId,
                nodeId,
            };

            return {
                ...current,
                dialogue: {
                    ...current.dialogue,
                    activeNodeId: nodeId,
                    history: [
                        ...current.dialogue.history,
                        historyEntry,
                    ],
                },
            };
        });
    }

    endDialogue(): void {
        this.domainState.update((current) => ({
            ...current,
            dialogue: {
                ...current.dialogue,
                activeDialogueId: null,
                activeNodeId: null,
            },
        }));
    }
}