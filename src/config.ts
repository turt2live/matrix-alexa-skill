import * as config from "config";
import { MatrixClient } from "matrix-bot-sdk";

interface IConfig {
    homeserverUrl: string;
    accessToken: string;
    pantalaimon: {
        use: boolean;
        username: string;
        password: string;
    };
    dataPath: string;
    hosted: boolean;
}

export default <IConfig>config;
