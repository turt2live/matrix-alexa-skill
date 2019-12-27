import * as config from "config";

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
    clientId: string;
    clientSecret: string;
}

export default <IConfig>config;
