import type {
    ProgressionState,
    Reward,
} from "../domain/index.js";

import type {
    DomainStateAccess,
} from "../state/index.js";

export class RewardService {
    constructor(
        private readonly domainState: DomainStateAccess,
    ) {}

    claim(reward: Reward): boolean {
        const current = this.domainState.get();

        if (
            current.reward.claimedRewardIds.includes(
                reward.id,
            )
        ) {
            return false;
        }

        this.domainState.update((state) => ({
            ...state,
            progression:
                this.applyRewardToProgression(
                    state.progression,
                    reward,
                ),
            reward: {
                ...state.reward,
                claimedRewardIds: [
                    ...state.reward.claimedRewardIds,
                    reward.id,
                ],
            },
        }));

        return true;
    }

    hasClaimed(rewardId: string): boolean {
        return this.domainState
            .get()
            .reward
            .claimedRewardIds
            .includes(rewardId);
    }

    private applyRewardToProgression(
        progression: ProgressionState,
        reward: Reward,
    ): ProgressionState {
        switch (reward.kind) {
            case "experience":
                return {
                    ...progression,
                    experience:
                        progression.experience +
                        reward.amount,
                };

            default:
                return assertNever(reward.kind);
        }
    }
}

const assertNever = (
    value: never,
): never => {
    throw new Error(
        `Unsupported reward kind: ${String(value)}`,
    );
};