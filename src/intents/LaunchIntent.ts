import * as Alexa from "ask-sdk";
import { Response } from 'ask-sdk-model';

export class LaunchIntent implements Alexa.RequestHandler{
    canHandle(handlerInput: Alexa.HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        if (request.type !== 'LaunchRequest') return false;
        return true;
    }

    handle(handlerInput: Alexa.HandlerInput): Promise<Response> | Response {
        return handlerInput.responseBuilder
            .speak(`Hello! What would you like me to do for you?`)
            .getResponse();
    }
}
