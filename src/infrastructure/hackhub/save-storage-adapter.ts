import { SaveStorage as HackHubSaveStorage } from "@hotbunny/hackhub-content-sdk";

import type { SaveStorage } from "../../state/index.js";

export class HackHubSaveStorageAdapter implements SaveStorage {
    constructor(private readonly namespace: string) {}

    write(serializedState: string): void {
        HackHubSaveStorage.set(this.namespace, serializedState);
    }

    read(): string | null {
        return (
            HackHubSaveStorage.get<string>(this.namespace) ??
            null
        );
    }
}
