export type PacketProtocol = "TCP" | "UDP" | "HTTP" | "HTTPS" | "DNS" | "TLS";

export interface PacketDefinition {
    readonly id: string;
    readonly protocol: PacketProtocol;
    readonly source: string;
    readonly destination: string;
    readonly length: number;
    readonly info: string;
}

export interface PacketCaptureProfile {
    readonly target: string;
    readonly localHost: string;
    readonly packets: readonly PacketDefinition[];
}

const PACKET_PROTOCOL_POOL: readonly PacketProtocol[] = [
    "TCP", "UDP", "HTTP", "HTTPS", "DNS", "TLS",
];

const PACKET_INFO_BY_PROTOCOL: Record<PacketProtocol, readonly string[]> = {
    TCP: ["SYN", "SYN, ACK", "ACK", "FIN, ACK"],
    UDP: ["Source port: 53", "Source port: 123"],
    HTTP: ["GET / HTTP/1.1", "200 OK (text/html)"],
    HTTPS: ["Client Hello", "Server Hello", "Application Data"],
    DNS: ["Standard query A", "Standard query response A"],
    TLS: ["Change Cipher Spec", "Encrypted Handshake Message"],
};

// Deterministic FNV-1a style hash so the same target + related hosts always
// synthesize the same capture, keeping Wireshark+ reproducible and testable.
const hashText = (value: string): number => {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
};

/**
 * Synthesizes a deterministic simulated packet capture between the local
 * host and a target (plus any hosts Recon already discovered for it).
 * DSS Wireshark+ is its own forensic workspace, not a wrapper around
 * HackHub's native Wireshark, so captures are investigation fixtures rather
 * than a live OS-level packet sniff.
 */
export const synthesizePacketCapture = (
    target: string,
    relatedHosts: readonly string[] = [],
): PacketCaptureProfile => {
    const localHost = "10.13.37.2";
    const peers = relatedHosts.length > 0 ? relatedHosts : [target];
    const seed = hashText(`${target}:${peers.join(",")}`);
    const packetCount = 8 + (seed % 9);

    let cursor = seed;
    const nextIndex = (max: number): number => {
        cursor = (cursor * 1103515245 + 12345) >>> 0;
        return cursor % max;
    };

    const packets: PacketDefinition[] = [];

    for (let index = 0; index < packetCount; index += 1) {
        const protocol = PACKET_PROTOCOL_POOL[nextIndex(PACKET_PROTOCOL_POOL.length)]!;
        const peer = peers[nextIndex(peers.length)]!;
        const infoPool = PACKET_INFO_BY_PROTOCOL[protocol];
        const info = infoPool[nextIndex(infoPool.length)]!;
        const outbound = nextIndex(2) === 0;

        packets.push({
            id: `pkt-${index + 1}`,
            protocol,
            source: outbound ? localHost : peer,
            destination: outbound ? peer : localHost,
            length: 54 + nextIndex(1400),
            info,
        });
    }

    return {
        target,
        localHost,
        packets,
    };
};
