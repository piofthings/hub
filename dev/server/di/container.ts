import * as express from "express";

import { Configuration } from "../services/settings/config-model";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { BaseController } from "../api/base-controller";

import { HomeController } from "../api/home-controller";
import { PassportLocalController } from "../api/passport-controller";
import { ProfileController } from "../api/profile-controller";
// import { FeedController } from "../api/feed-controller";
import { DeviceController } from "../api/device-controller";
import { CrossRouter } from "../services/routing/cross-router";
import { CrossRoute } from "../services/routing/cross-route";

import { MoscaServer } from "../mqtt/mosca-server";

export class Container {
    private static config: Configuration;
    public static apiRouter: CrossRouter;
    public static webRouter: CrossRouter;
    public static moscaServer: MoscaServer;
    public static inject = (configuration: Configuration, authenticator: PassportLocalAuthenticator, logger: any) => {
        Container.config = configuration;
        Container.moscaServer = new MoscaServer(configuration);
        Container.moscaServer.start();
        Container.injectWebController(new HomeController(Container.config, authenticator, logger));
        Container.injectController(new PassportLocalController(Container.config, authenticator, logger));
        Container.injectController(new ProfileController(Container.config, authenticator, logger));
        // Container.injectController(new FeedController(Container.config, authenticator, logger));
        Container.injectController(new DeviceController(Container.config, authenticator, logger, Container.moscaServer));
    }

    private static injectController = (controller: BaseController) => {
        let keys = Object.keys(controller);
        keys.forEach((key: string)=>{
            if(typeof(controller[key]) == "string"){
                Container.apiRouter.registerRoute(new CrossRoute(controller[key], key.replace(":path", ""), "", controller));
            }
        });
    }

    private static injectWebController = (controller: BaseController) => {
        let keys = Object.keys(controller);
        keys.forEach((key: string)=>{
            if(typeof(controller[key]) == "string"){
                Container.webRouter.registerRoute(new CrossRoute(controller[key], key.replace(":path", ""), "", controller));
            }
        });
    }
}
