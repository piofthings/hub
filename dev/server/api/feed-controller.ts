import * as Express from "express";
import * as ExpressExtensions from "../interops/express-extensions";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { VerificationEmailer } from "../services/mailing/verification-emailer";
import { AzureDownloader } from "../services/azure-storage/downloader";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";

export class FeedController extends BaseController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.repository = new db(this.config);

        this["Feed:path"] = "/feed/:userId:";
    }

    public getFeed = (req: Express.Request, res: Express.Response, next, params) => {
        if (this.isLoggedIn(req)) {
            this.repository.FeedItem.getFeedByUserId(req.user._id, (error, values) => {
                if (error != null) {
                    res.status(500).send({ message: error.message });
                }
                else {
                    res.send(values);
                }
            });
        }
        else {
            res.status(403).send({ message: "Unauthorized: Please login" });

        }
    }

    public deleteFeed = (req: Express.Request, res: Express.Response, next, params) => {
        if (this.isLoggedIn(req)) {
            this.logger.info("FeedItem _id:" + req.body._id + ": Request UserId: " + req.user._id);
            this.repository.FeedItem.deleteFeedItem(req.user._id, req.body._id, (error, value) => {
                if (error != null) {
                    res.status(500).send({ message: error.message });
                }
                else {
                    res.status(200).send(value);
                }
            });
        }
        else {
            res.status(403).send({ message: "Unauthorized: Please login" });
        }
    }

    public postFeed = (req: Express.Request, res: Express.Response, next, params) => {
        if (this.isLoggedIn(req)) {
            console.log("POST Feed:" + JSON.stringify(req.body, null, 1));
            this.repository.FeedItem.create(new this.repository.FeedItem({
                title: req.body.title,
                body: req.body.body,
                userId: req.user._id
            }), (error, value) => {
                if (error) {
                    res.status(500).send({ message: "Error saving post!" });
                }
                else {
                    res.status(200).send(value);
                }
            });
        }
        else {
            res.status(403).send({ message: "Unauthorized, please sign in to post!" });
        }
    }
}
