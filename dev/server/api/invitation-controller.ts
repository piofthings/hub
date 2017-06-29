import * as Express from "express";
import * as ExpressExtensions from "../interops/express-extensions";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { VerificationEmailer } from "../services/mailing/verification-emailer";
import { AzureDownloader } from "../services/azure-storage/downloader";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";

export class InvitationController extends BaseController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.repository = new db(this.config);

        this["Invitation:path"] = "/invitations/new";
    }

    public postInvitation = (req: Express.Request & ExpressExtensions.Request, res: Express.Response, next, params) => {
        console.log(JSON.stringify(req.body));
        try {
            this.repository.Invite.createInvite(req.body, req.user._id, (error, value) => {
                if (error) {
                    res.status(500).send({ message: "Error saving invite!" });
                }
                else {
                    res.status(200).send(value);
                }
            });
        }
        catch (ex) {
            console.log(ex);
        }
    }
}
