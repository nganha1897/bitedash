import * as express from "express";
export declare class Server {
    app: express.Application;
    constructor();
    setConfigs(): void;
    dotenvConfigs(): void;
    connectMongoDB(): void;
    connectRedis(): void;
    configureBodyParser(): void;
    configureFileUpload(): void;
    allowCors(): void;
    setRoutes(): void;
    error404Handler(): void;
    handleErrors(): void;
}
