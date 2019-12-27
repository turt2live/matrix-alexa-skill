import * as Alexa from 'ask-sdk';
import * as express from "express";
import * as bodyParser from "body-parser";
import { LaunchIntent } from "./intents/LaunchIntent";
import { SendMessageIntent } from "./intents/SendMessageIntent";
import { LogLevel, LogService, RichConsoleLogger } from "matrix-bot-sdk";

LogService.setLogger(new RichConsoleLogger());
LogService.setLevel(LogLevel.INFO);

const skill = Alexa.SkillBuilders.custom().addRequestHandlers(
    new LaunchIntent(),
    new SendMessageIntent(),
).create();

const app = express();
app.use(bodyParser.json());
app.post('/', (req, res) => {
    skill.invoke(req.body).then(b => res.json(b)).catch(e => {
        LogService.error("index", e);
        res.status(500).send('Error during the request');
    });
});
app.listen(8184, () => LogService.info("index", "Now listening for Alexa requests"));
