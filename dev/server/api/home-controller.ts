import * as Express from "express-serve-static-core";
import { BaseController } from "./base-controller";
import { Configuration } from "../services/settings/config-model";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";

export class HomeController extends BaseController {
    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this["Home:path"] = "/:route*:";
    }

    public getHome = (req: Express.Request, res: Express.Response, next) => {
        this.renderSpa(req, res, next);
    }

    private renderSpa = (req: Express.Request, res: Express.Response, next) => {
        res.status(200);
        if (req.url.lastIndexOf("www") > 0 ||
            req.url.lastIndexOf("libs") > 0 ||
            req.url.lastIndexOf("spec") > 0 ||
            req.url.lastIndexOf("api") > 0 ||
            req.url.lastIndexOf("scripts") > 0 ||
            req.url.lastIndexOf("static") > 0 ||
            req.url.lastIndexOf("images") > 0 ||
            req.url.lastIndexOf("styles") > 0) {
            next();
        }
        else {
            res.render("index");
        }
    }
}
