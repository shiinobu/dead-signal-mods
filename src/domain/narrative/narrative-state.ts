export interface NarrativeState {
    readonly chapterId: string | null;
    readonly sceneId: string | null;
    readonly completedChapterIds: readonly string[];
}