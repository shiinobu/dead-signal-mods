import {
    Files,
    Quest as HackHubQuest,
    RegisterQuest,
} from "@hotbunny/hackhub-content-sdk";

import {
    Q14_THE_OWNER,
} from "../../content/index.js";

import {
    asId,
} from "../../core/index.js";

import {
    gameRuntime,
} from "./runtime.js";

interface Q14QuestData {
    readonly registryPath: string;
    readonly sessionPath: string;
    readonly authorizationPath: string;
    readonly approverPath: string;
    readonly justificationPath: string;
    readonly registryFileId: string;
    readonly sessionFileId: string;
    readonly authorizationFileId: string;
    readonly approverFileId: string;
    readonly justificationFileId: string;
}

const Q14_BASE_XP = 130;
const Q14_OPTIONAL_XP = 10;

const Q14_ROOT = "/exports/operations/dead-signal/q14";
const Q14_AUTHORIZATIONS = `${Q14_ROOT}/authorizations`;
const Q14_SESSIONS = `${Q14_ROOT}/sessions`;
const Q14_IDENTITY = `${Q14_ROOT}/identity`;

const Q14_REGISTRY_PATH = `${Q14_AUTHORIZATIONS}/access-registry.txt`;
const Q14_SESSION_PATH = `${Q14_SESSIONS}/A-77402.session`;
const Q14_AUTHORIZATION_PATH = `${Q14_AUTHORIZATIONS}/AR-44192.txt`;
const Q14_APPROVER_PATH = `${Q14_IDENTITY}/M-REED.txt`;
const Q14_JUSTIFICATION_PATH = `${Q14_AUTHORIZATIONS}/AR-44192-justification.txt`;

const ACCESS_REGISTRY_CONTENT = [
    "ACCESS REGISTRY",
    "IDENTITY: OVERRIDE_OPERATOR",
    "MODEL: DELEGATED / SHARED PRIVILEGED IDENTITY",
    "STATUS: ACTIVE",
].join("\n");

const SESSION_CONTENT = [
    "SESSION",
    "ID: A-77402",
    "IDENTITY: OVERRIDE_OPERATOR",
    "AUTHORIZATION: AR-44192",
    "START: 2026-08-18 02:12:19",
    "END: 2026-08-18 02:19:06",
    "AUTH CONTEXT: delegated-privileged",
].join("\n");

const AUTHORIZATION_CONTENT = [
    "ACCESS REQUEST",
    "REQUEST ID: AR-44192",
    "IDENTITY: OVERRIDE_OPERATOR",
    "REQUESTED ACCESS: PRIVILEGED OPERATIONS",
    "APPROVER: M.REED",
    "STATUS: APPROVED",
    "LINKED SESSION: A-77402",
].join("\n");

const APPROVER_CONTENT = [
    "EMPLOYEE REFERENCE: ARKA-SEC-017",
    "NAME: Marcus Reed",
    "ROLE: Executive Director",
    "AUTHORIZATION ROLE: Security Administration",
    "STATUS: ACTIVE",
].join("\n");

const JUSTIFICATION_CONTENT = [
    "ACCESS REQUEST",
    "ID: AR-44192",
    "JUSTIFICATION: Emergency operational maintenance",
    "REQUESTED BY: Operations",
    "APPROVED BY: M.REED",
    "ACCESS WINDOW: 01:45 — 03:00",
    "RELATED SYSTEM: relationship-policy",
    "NOTES: Temporary access",
].join("\n");

const ensureFolder = async (
    path: string,
    name: string,
    parentPath: string,
): Promise<void> => {
    if (await Files.exists(path)) {
        const existing = await Files.getByPath(path);

        if (!existing?.isFolder) {
            throw new Error(`Q14 path exists but is not a folder: ${path}`);
        }

        return;
    }

    await Files.create({
        name,
        parentPath,
        isFolder: true,
    });
};

const ensureFile = async (
    path: string,
    name: string,
    extension: string,
    parentPath: string,
    data: string,
): Promise<string> => {
    if (await Files.exists(path)) {
        const existing = await Files.getByPath(path);

        if (!existing) {
            throw new Error(`Q14 file disappeared after existence check: ${path}`);
        }

        await Files.write(existing.id, data);
        return existing.id;
    }

    const created = await Files.create({
        name,
        extension,
        parentPath,
        data,
    });

    return created.id;
};

const markFlag = (
    key: string,
    value = true,
): void => {
    gameRuntime.flagStore.set(key, value);
    gameRuntime.persistence.save();
};

const matchesFileEvent = (
    data: unknown,
    fileId: string,
    path: string,
): boolean => {
    const payload = data as {
        id?: string;
        fileId?: string;
        path?: string;
    };

    const emittedFileId = payload?.id ?? payload?.fileId;

    return emittedFileId === fileId || payload?.path === path;
};

const createMarcusContact = (
    quest: DeadSignalQ14Quest,
): void => {
    if (
        gameRuntime.flagStore.get<boolean>(
            "dead_signal.marcus_introduced",
        ) === true
    ) {
        return;
    }

    markFlag("dead_signal.marcus_introduced");
    quest.createDialog("default");
};

@RegisterQuest
export class DeadSignalQ14Quest extends HackHubQuest<Q14QuestData> {
    override Name = "dead_signal.q14";
    override Title = "THE OWNER";
    override Description =
        "Investigate who was authorized to use the OVERRIDE_OPERATOR delegated identity.";
    override Group = "storyline" as const;
    override AutoStart = false;
    override AutoComplete = true;
    override Rewards = {
        money: 0,
        xp: Q14_BASE_XP,
    };
    override QuestsToComplete = ["dead_signal.q13"];

    override Objectives = [
        {
            name: "q14.objective.01",
            description: "Find the access registry.",
        },
        {
            name: "q14.objective.02",
            description: "Trace the access window.",
            unlocksAfter: ["q14.objective.01"],
        },
        {
            name: "q14.objective.03",
            description: "Find the authorization.",
            unlocksAfter: ["q14.objective.02"],
        },
        {
            name: "q14.objective.04",
            description: "Resolve the approver.",
            unlocksAfter: ["q14.objective.03"],
        },
        {
            name: "q14.objective.05",
            description: "Speak to Marcus and confirm the authority context.",
            unlocksAfter: ["q14.objective.04"],
        },
        {
            name: "q14.objective.06",
            description: "Ask about the session.",
            unlocksAfter: ["q14.objective.05"],
        },
    ];

    override async CreateData(): Promise<Q14QuestData> {
        await ensureFolder("/exports", "exports", "/");
        await ensureFolder(
            "/exports/operations",
            "operations",
            "/exports",
        );
        await ensureFolder(
            Q14_ROOT,
            "dead-signal",
            "/exports/operations",
        );
        await ensureFolder(
            Q14_AUTHORIZATIONS,
            "authorizations",
            Q14_ROOT,
        );
        await ensureFolder(
            Q14_SESSIONS,
            "sessions",
            Q14_ROOT,
        );
        await ensureFolder(
            Q14_IDENTITY,
            "identity",
            Q14_ROOT,
        );

        const registryFileId = await ensureFile(
            Q14_REGISTRY_PATH,
            "access-registry",
            "txt",
            Q14_AUTHORIZATIONS,
            ACCESS_REGISTRY_CONTENT,
        );
        const sessionFileId = await ensureFile(
            Q14_SESSION_PATH,
            "A-77402",
            "session",
            Q14_SESSIONS,
            SESSION_CONTENT,
        );
        const authorizationFileId = await ensureFile(
            Q14_AUTHORIZATION_PATH,
            "AR-44192",
            "txt",
            Q14_AUTHORIZATIONS,
            AUTHORIZATION_CONTENT,
        );
        const approverFileId = await ensureFile(
            Q14_APPROVER_PATH,
            "M-REED",
            "txt",
            Q14_IDENTITY,
            APPROVER_CONTENT,
        );
        const justificationFileId = await ensureFile(
            Q14_JUSTIFICATION_PATH,
            "AR-44192-justification",
            "txt",
            Q14_AUTHORIZATIONS,
            JUSTIFICATION_CONTENT,
        );

        return {
            registryPath: Q14_REGISTRY_PATH,
            sessionPath: Q14_SESSION_PATH,
            authorizationPath: Q14_AUTHORIZATION_PATH,
            approverPath: Q14_APPROVER_PATH,
            justificationPath: Q14_JUSTIFICATION_PATH,
            registryFileId,
            sessionFileId,
            authorizationFileId,
            approverFileId,
            justificationFileId,
        };
    }

    override OnStart() {
        gameRuntime.quest.start(Q14_THE_OWNER);
    }

    override OnObjectivesStart() {
        this.Events.on("Files.Open", (data) => {
            if (
                matchesFileEvent(
                    data,
                    this.Data.registryFileId,
                    this.Data.registryPath,
                )
            ) {
                markFlag(
                    "dead_signal.q14.override_access_registry_found",
                );
                markFlag(
                    "dead_signal.q14.delegated_access_confirmed",
                );
                this.completeObjective("q14.objective.01");
                return;
            }

            if (
                matchesFileEvent(
                    data,
                    this.Data.sessionFileId,
                    this.Data.sessionPath,
                ) &&
                gameRuntime.flagStore.get<boolean>(
                    "dead_signal.q14.override_access_registry_found",
                ) === true
            ) {
                markFlag(
                    "dead_signal.q14.access_window_found",
                );
                markFlag(
                    "dead_signal.q14.override_session_found",
                );
                this.completeObjective("q14.objective.02");
                return;
            }

            if (
                matchesFileEvent(
                    data,
                    this.Data.authorizationFileId,
                    this.Data.authorizationPath,
                ) &&
                gameRuntime.flagStore.get<boolean>(
                    "dead_signal.q14.override_session_found",
                ) === true
            ) {
                markFlag(
                    "dead_signal.q14.marcus_access_approval_confirmed",
                );
                this.completeObjective("q14.objective.03");
                return;
            }

            if (
                matchesFileEvent(
                    data,
                    this.Data.approverFileId,
                    this.Data.approverPath,
                ) &&
                gameRuntime.flagStore.get<boolean>(
                    "dead_signal.q14.marcus_access_approval_confirmed",
                ) === true
            ) {
                markFlag("dead_signal.q14.marcus_reed_confirmed");
                this.completeObjective("q14.objective.04");
                createMarcusContact(this);
                return;
            }

            if (
                matchesFileEvent(
                    data,
                    this.Data.justificationFileId,
                    this.Data.justificationPath,
                )
            ) {
                markFlag(
                    "dead_signal.q14.exception_access_found",
                );
            }
        });

        if (
            gameRuntime.flagStore.get<boolean>(
                "dead_signal.q14.marcus_reed_confirmed",
            ) === true
        ) {
            createMarcusContact(this);
        }
    }

    override Dialog = {
        default: [
            {
                speaker: "Marcus Reed",
                text: "You've been looking at OVERRIDE_OPERATOR.",
            },
            {
                speaker: "Player",
                text: "Yes.",
            },
            {
                speaker: "Marcus Reed",
                text: "Then you've probably seen my name.",
            },
            {
                speaker: "Player",
                text: "M. Reed.",
            },
            {
                speaker: "Marcus Reed",
                text: "That's me.",
            },
            {
                speaker: "Player",
                text: "You approved AR-44192.",
            },
            {
                speaker: "Marcus Reed",
                text: "I approved an access request.",
            },
            {
                speaker: "Player",
                text: "For OVERRIDE_OPERATOR.",
            },
            {
                speaker: "Marcus Reed",
                text: "Correct.",
                onEnd: () => {
                    markFlag(
                        "dead_signal.marcus_authority_confirmed",
                    );
                    this.completeObjective(
                        "q14.objective.05",
                    );
                },
            },
            {
                speaker: "Player",
                text: "Why?",
            },
            {
                speaker: "Marcus Reed",
                text: "Privileged operational access requires approval.",
            },
            {
                speaker: "Player",
                text: "What was the access for?",
            },
            {
                speaker: "Marcus Reed",
                text: "The request says operational maintenance.",
            },
            {
                speaker: "Player",
                text: "That's all?",
            },
            {
                speaker: "Marcus Reed",
                text: "That's what was submitted.",
            },
            {
                speaker: "Player",
                text: "Did you use this session?",
            },
            {
                speaker: "Marcus Reed",
                text: "No.",
            },
            {
                speaker: "Player",
                text: "Did you know who did?",
            },
            {
                speaker: "Marcus Reed",
                text: "The identity was delegated.",
            },
            {
                speaker: "Player",
                text: "That's not an answer.",
            },
            {
                speaker: "Marcus Reed",
                text: "It's the only answer the authorization record supports.",
            },
            {
                speaker: "Player",
                text: "You approved access.",
            },
            {
                speaker: "Marcus Reed",
                text: "Yes.",
            },
            {
                speaker: "Player",
                text: "But you didn't use it.",
            },
            {
                speaker: "Marcus Reed",
                text: "Correct.",
                isEnd: true,
                onEnd: () => {
                    markFlag(
                        "dead_signal.q14.operator_identity_unknown",
                    );
                    markFlag(
                        "dead_signal.q14.delegated_access_confirmed",
                    );
                    this.completeObjective(
                        "q14.objective.06",
                    );
                },
            },
        ],
    };

    override OnComplete() {
        markFlag(
            "dead_signal.q14.primary_audit_system_required",
        );

        const completion = gameRuntime.quest.complete(
            Q14_THE_OWNER,
        );

        if (!completion) {
            throw new Error(
                "Q14 HackHub completion diverged from canonical runtime completion.",
            );
        }

        markFlag("dead_signal.q14.completed");

        gameRuntime.reward.claim({
            id: asId<"Reward">("dead_signal.q14.xp.base"),
            kind: "experience",
            amount: Q14_BASE_XP,
        });

        if (
            gameRuntime.flagStore.get<boolean>(
                "dead_signal.q14.exception_access_found",
            ) === true
        ) {
            gameRuntime.reward.claim({
                id: asId<"Reward">(
                    "dead_signal.q14.xp.exception-access",
                ),
                kind: "experience",
                amount: Q14_OPTIONAL_XP,
            });
        }

        gameRuntime.persistence.save();
    }
}
