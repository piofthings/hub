import * as Express from "express-serve-static-core";
import { BaseController } from "./base-controller";
import { Configuration } from "../services/settings/config-model";
import { VerificationEmailer } from "../services/mailing/verification-emailer";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";
import { AzureDownloader } from "../services/azure-storage/downloader";


var Account = require("../data/account");

export class ContentController extends BaseController {
    config: Configuration;
    repository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.repository = new db(this.config);

        this["Content:path"] = "/content/{ownerId}/{contentId}";
    }

    public getContent = (req, res, next, params) => {
        //console.log("going to get content:" + JSON.stringify(params));
        try {
            let downloader = new AzureDownloader(this.config, super.getLogger());
            downloader.getImageFromBlob(params.contentId, params.ownerId, (error, result) => {

                if (error) {
                    //console.error("ERROR: Getting content:", error);
                    this.logger.error(error, "ERROR: Getting content");
                }
                else {
                    res.send(result);
                }

            });
        }
        catch (err) {
            this.logger.error(err, "getContent failed");
        }
        //res.send("Came here");
    }
}
