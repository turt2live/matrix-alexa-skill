import { MatrixClient, MatrixProfile, PantalaimonClient, SimpleFsStorageProvider } from "matrix-bot-sdk";
import config from "./config";
import * as path from "path";
import { EnPhoneticDistance, FuzzyMatcher } from "phoneticmatching";

const clientCache: { [alexaUserId: string]: MatrixClient } = {};

export async function getClientForUser(alexaUserId: string): Promise<MatrixClient> {
    if (clientCache[alexaUserId]) return clientCache[alexaUserId];

    if (config.hosted) {
        // TODO: Support proper hosting
        return null;
    }

    let client: MatrixClient;
    const storage = new SimpleFsStorageProvider(path.join(config.dataPath, "bot.json"));
    if (config.pantalaimon.use) {
        const pantalaimon = new PantalaimonClient(config.homeserverUrl, storage);
        client = await pantalaimon.createClientWithCredentials(config.pantalaimon.username, config.pantalaimon.password);
    } else {
        client = new MatrixClient(config.homeserverUrl, config.accessToken, storage);
    }
    clientCache[alexaUserId] = client;
    return client;
}

export async function searchForRoom(client: MatrixClient, phoneticName: string): Promise<string> {
    const roomIds = await client.getJoinedRooms();
    const myUserId = await client.getUserId();
    const targets:{roomId: string, name: string, toString:()=>string}[] = [];
    for (const roomId of roomIds) {
        let name: string;
        try {
            const content = await client.getRoomStateEvent(roomId, "m.room.name", "");
            name = content['name'];
        } catch (e) {
            // probably not found
        }

        if (!name) {
            // No name yet - default to members
            const joined = await client.getRoomMembers(roomId, null, ['join', 'invite']);
            const withoutUs = joined.filter(e => e.membershipFor !== myUserId);
            if (withoutUs.length > 1) continue; // too hard to name for now

            const event = withoutUs[0];
            const profile = new MatrixProfile(event.membershipFor, event.content);
            name = profile.displayName;
        }

        targets.push({roomId, name, toString: () => name});
    }

    const matcher = new FuzzyMatcher(targets, new EnPhoneticDistance());
    const result = matcher.nearest(phoneticName);
    if (result) return result.element.roomId;
    return null;
}
