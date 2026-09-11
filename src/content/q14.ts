import { asId } from "../core/index.js";
import type { Quest } from "../domain/quest/index.js";
import {
    all,
    flagEquals,
} from "../domain/shared/index.js";

/**
 * Source-backed Q14 definition.
 *
 * This file contains only the recovered locked Q14 objectives and the exact
 * persistent state keys named by the source artifact. It does not register
 * the quest with HackHub or introduce new story state.
 */
export const Q14_THE_OWNER: Quest = {
    id: asId<"Quest">("dead_signal.q14"),
    chapterId: "04",
    title: "THE OWNER",
    description:
        "Investigation into who was authorized to use the OVERRIDE_OPERATOR delegated identity.",
    objectives: [
        {
            id: "q14.objective.01",
            description: "Find the access registry.",
            condition: flagEquals(
                "dead_signal.q14.override_access_registry_found",
                true,
            ),
        },
        {
            id: "q14.objective.02",
            description: "Trace the access window.",
            condition: flagEquals(
                "dead_signal.q14.access_window_found",
                true,
            ),
        },
        {
            id: "q14.objective.03",
            description: "Find the authorization.",
            condition: flagEquals(
                "dead_signal.q14.marcus_access_approval_confirmed",
                true,
            ),
        },
        {
            id: "q14.objective.04",
            description: "Resolve the approver.",
            condition: flagEquals(
                "dead_signal.q14.marcus_reed_confirmed",
                true,
            ),
        },
        {
            id: "q14.objective.05",
            description: "Speak to Marcus and confirm the authority context.",
            condition: all(
                flagEquals("dead_signal.marcus_introduced", true),
                flagEquals("dead_signal.marcus_authority_confirmed", true),
            ),
        },
        {
            id: "q14.objective.06",
            description: "Ask about the session.",
            condition: flagEquals(
                "dead_signal.q14.operator_identity_unknown",
                true,
            ),
        },
        {
            id: "q14.objective.07",
            description: "Check the access justification.",
            condition: flagEquals(
                "dead_signal.q14.exception_access_found",
                true,
            ),
            optional: true,
        },
    ],
};
