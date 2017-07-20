import * as Express from "express";
import * as ExpressExtensions from "../interops/express-extensions";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { MoscaServer } from "../mqtt/mosca-server";
import { HubMessage } from "../data/hub-message";

export class DeviceController extends BaseController
{
    private mosquitto : MoscaServer;
    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any, moscaServer: MoscaServer)
    {
        super(auther, logger);
        this.mosquitto = moscaServer;
        this["Device:path"] = "/device/:deviceid:";
    }

    postDevice = (req: Express.Request, res: Express.Response, next, params) => {
        let testMessage = new HubMessage<string>();
        console.log(req.body);
        testMessage.topic = "/Relays";
        testMessage.payload = JSON.stringify(req.body);
        this.mosquitto.send<string>(testMessage, (error, payload) => {
            console.log("error = " + error);
            console.log("something-value = " + JSON.stringify(payload));
        });
        res.status(200);
    }
}
