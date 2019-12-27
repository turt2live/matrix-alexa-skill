import * as config from "config";

interface IConfig {
    // Everyone settings
    dataPath: string;
    listenPort: number;
    listenAddress: string;

    // Self-hosting settings
    homeserverUrl: string;
    accessToken: string;
    pantalaimon: {
        use: boolean;
        username: string;
        password: string;
    };

    // Hosting settings
    hosted: boolean;
    clientId: string;
    clientSecret: string;
}

export default <IConfig>config;
