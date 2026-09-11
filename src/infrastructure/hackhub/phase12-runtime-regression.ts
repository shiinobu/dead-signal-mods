import {
    UI,
} from "@hotbunny/hackhub-content-sdk";

import {
    asId,
} from "../../core/index.js";
import {
    always,
    flagEquals,
} from "../../domain/shared/index.js";
import type {
    AccessGrant,
    Ending,
    Quest,
    Reward,
} from "../../domain/index.js";
import {
    GameRuntime,
} from "../../application/game-runtime.js";
import {
    HackHubSaveStorageAdapter,
} from "./save-storage-adapter.js";

const RUNTIME_NAMESPACE = "dead-signal.phase12.full-regression";
const ACTOR_ID = asId<"Character">("marcus");
const QUEST_ID = asId<"Quest">("phase12-regression-quest");
const GRANT_ID = asId<"AccessGrant">("phase12-regression-operator");
const REWARD_ID = asId<"Reward">("phase12-regression-experience");
const ENDING_ID = "phase12-regression-ending";
const ENDING_FLAG = "phase12.regression.ready";

export function runPhase12RuntimeRegression(): void {
    const storage = new HackHubSaveStorageAdapter(RUNTIME_NAMESPACE);

    const quest: Quest = {
        id: QUEST_ID,
        chapterId: "phase12",
        title: "Phase 12 Runtime Regression",
        description: "Internal runtime regression quest.",
        objectives: [
            {
                id: "runtime-ready",
                description: "Runtime regression objective.",
                condition: always(),
            },
        ],
    };

    const grant: AccessGrant = {
        id: GRANT_ID,
        actorId: ACTOR_ID,
        capability: "OVERRIDE_OPERATOR",
    };

    const reward: Reward = {
        id: REWARD_ID,
        kind: "experience",
        amount: 250,
    };

    const ending: Ending = {
        id: ENDING_ID,
        condition: flagEquals(ENDING_FLAG, true),
    };

    try {
        const runtime = new GameRuntime(undefined, undefined, storage);

        // Reset this dedicated regression namespace so every execution starts
        // from the same clean runtime state before the persistence checkpoint.
        runtime.persistence.save();
        runtime.persistence.load();

        runtime.narrativeState.setChapter("phase12");
        runtime.narrativeState.setScene("regression");
        runtime.narrativeState.startDialogue("phase12-regression", "start");
        runtime.narrativeState.advanceDialogue("checkpoint");
        runtime.narrativeState.endDialogue();
        runtime.narrativeState.completeChapter("phase12");

        runtime.flagStore.set(ENDING_FLAG, true);

        runtime.quest.start(quest);
        if (!runtime.quest.isActive(quest)) {
            throw new Error("QuestService did not activate the regression quest.");
        }

        if (!runtime.quest.areObjectivesComplete(quest)) {
            throw new Error("QuestService did not evaluate the regression objective.");
        }

        if (!runtime.quest.complete(quest)) {
            throw new Error("QuestService did not complete the regression quest.");
        }

        runtime.access.grant(grant);
        if (!runtime.access.hasCapability(ACTOR_ID, "OVERRIDE_OPERATOR")) {
            throw new Error("AccessService regression grant is missing.");
        }

        if (runtime.access.getGrants().length !== 1) {
            throw new Error("AccessService regression grant count is incorrect.");
        }

        if (!runtime.reward.claim(reward)) {
            throw new Error("RewardService regression claim failed.");
        }

        if (runtime.reward.claim(reward)) {
            throw new Error("RewardService regression allowed a duplicate claim.");
        }

        runtime.economy.credit(100, "SYSTEM", "phase12-regression");

        if (runtime.economy.getBalance() !== 100) {
            throw new Error("EconomyService regression balance is incorrect.");
        }

        if (runtime.ending.resolve([ending]) !== ENDING_ID) {
            throw new Error("EndingService regression did not resolve the ending.");
        }

        runtime.persistence.save();

        const restoredRuntime = new GameRuntime(undefined, undefined, storage);
        if (!restoredRuntime.persistence.load()) {
            throw new Error("Regression persistence load returned false.");
        }

        const restoredState = restoredRuntime.stateStore.getState().domain;

        if (restoredState.quests.activeQuestId !== null) {
            throw new Error("Active quest remained after quest completion.");
        }

        if (!restoredRuntime.quest.isCompleted(quest)) {
            throw new Error("Completed quest did not survive persistence restore.");
        }

        if (restoredState.narrative.chapterId !== "phase12") {
            throw new Error("Narrative chapter did not survive persistence restore.");
        }

        if (restoredState.narrative.sceneId !== "regression") {
            throw new Error("Narrative scene did not survive persistence restore.");
        }

        if (restoredState.narrative.completedChapterIds.includes("phase12") !== true) {
            throw new Error("Completed chapter did not survive persistence restore.");
        }

        if (restoredState.dialogue.activeDialogueId !== null) {
            throw new Error("Dialogue remained active after endDialogue().");
        }

        if (!restoredRuntime.access.hasCapability(ACTOR_ID, "OVERRIDE_OPERATOR")) {
            throw new Error("Access capability did not survive persistence restore.");
        }

        if (!restoredRuntime.reward.hasClaimed(REWARD_ID)) {
            throw new Error("Claimed reward did not survive persistence restore.");
        }

        if (restoredState.progression.experience !== 250) {
            throw new Error("Reward progression did not survive persistence restore.");
        }

        if (restoredRuntime.economy.getBalance() !== 100) {
            throw new Error("Economy balance did not survive persistence restore.");
        }

        if (restoredRuntime.ending.getEndingId() !== ENDING_ID || !restoredRuntime.ending.isResolved()) {
            throw new Error("Resolved ending did not survive persistence restore.");
        }

        if (restoredRuntime.flagStore.get<boolean>(ENDING_FLAG) !== true) {
            throw new Error("Regression flag did not survive persistence restore.");
        }

        UI.notify("DEAD SIGNAL Phase 12: Full runtime regression PASS");
    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : String(error);

        console.error("[DEAD SIGNAL] Phase 12 full runtime regression failed", error);
        UI.notify(`DEAD SIGNAL Phase 12: Full runtime regression FAILED: ${message}`);
    }
}
