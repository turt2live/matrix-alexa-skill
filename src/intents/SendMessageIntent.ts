import * as Alexa from "ask-sdk";
import { Response } from 'ask-sdk-model';
import { getClientForUser, searchForRoom } from "../matrix";

export class SendMessageIntent implements Alexa.RequestHandler {
    canHandle(handlerInput: Alexa.HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        if (request.type !== 'IntentRequest') return false;
        if (request.intent.name !== 'SendMessageIntent') return false;
        return true;
    }

    async handle(handlerInput: Alexa.HandlerInput): Promise<Response> {
        const name = Alexa.getSlotValue(handlerInput.requestEnvelope, 'displayName');
        const message = Alexa.getSlotValue(handlerInput.requestEnvelope, 'message');

        const client = await getClientForUser(handlerInput.requestEnvelope);
        if (!client) {
            return handlerInput.responseBuilder
                .speak("Please link your Matrix account before using this skill.")
                .getResponse();
        }

        const roomId = await searchForRoom(client, name);
        if (roomId) {
            await client.sendText(roomId, message);
        } else {
            return handlerInput.responseBuilder
                .speak(`Sorry, I can't find a conversation for ${name}. Please start a new chat first or label your existing chat.`)
                .getResponse();
        }

        return handlerInput.responseBuilder
            .speak(`I've said ${message} to ${name}`)
            .getResponse();
    }
}
