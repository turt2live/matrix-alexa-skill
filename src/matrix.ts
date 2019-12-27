import { MatrixClient, MatrixProfile, PantalaimonClient, SimpleFsStorageProvider } from "matrix-bot-sdk";
import config from "./config";
import * as path from "path";
import { EnPhoneticDistance, FuzzyMatcher } from "phoneticmatching";
import * as AlexaModel from "ask-sdk-model";
import * as crypto from "crypto";

const clientCache: { [alexaUserId: string]: MatrixClient } = {};

export async function getClientForUser(request: AlexaModel.RequestEnvelope): Promise<MatrixClient> {
    const alexaUserId = request.session.user.userId;
    if (clientCache[alexaUserId]) return clientCache[alexaUserId];

    if (config.hosted) {
        const authToken = request.session.user.accessToken;
        if (!authToken) return null;

        const buf = Buffer.from(authToken.substring("v1.".length), 'hex');
        const iv = buf.slice(0, 16);
        const salt = buf.slice(16, 80); // 64 bytes
        const encrypted = buf.slice(80);

        const cryptKey = crypto.pbkdf2Sync(`${config.clientId}|${config.clientSecret}`, salt, 100000, 32, 'sha512');
        const decipher = crypto.createDecipheriv('aes-256-cbc', cryptKey, iv);
        const result = decipher.update(encrypted) + decipher.final('utf-8');
        const auth = JSON.parse(result);

        const userId = auth['userId'];
        const userIdHash = crypto.createHash('md5').update(userId).digest('hex');
        const storage = new SimpleFsStorageProvider(path.join(config.dataPath, userIdHash + ".json"));
        const client = new MatrixClient(auth['homeserverUrl'], auth['accessToken'], storage);
        clientCache[alexaUserId] = client;
        return client;
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
            if (withoutUs.length > 1 || withoutUs.length === 0) continue; // too hard to name for now

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
