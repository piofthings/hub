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

    postDevice = (req: Express.Request, res: Express.Response, next, params)=>{
        let testMessage = new HubMessage<string>();
        testMessage.topic = "/Relays";
        testMessage.payload = "{ switch :  'on' }";
        this.mosquitto.send<string>(testMessage, (something, something2) => {
            console.log("something = " + something);
            console.log("something-value = " + JSON.stringify(something2));
        });
    }

}
