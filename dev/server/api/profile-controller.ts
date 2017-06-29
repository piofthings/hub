import * as Express from "express";
import * as ExpressExtensions from "../interops/express-extensions";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { VerificationEmailer } from "../services/mailing/verification-emailer";
import { AzureDownloader } from "../services/azure-storage/downloader";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";

export class ProfileController extends BaseController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.repository = new db(this.config);

        this["Profile:path"] = "/profile/:userId:";
    }

    public getProfile = (req: Express.Request, res: Express.Response, next, params) => {
        let id: string = "";
        if (req.user != null && req.user._id != "" && req.user._id != null) {
            this.repository.Profile.getProfileByUserId(req.user._id, (error, profile) => {
                if (error) {
                    this.logger.error(error, "Profile for userId not found:" + req.user._id);
                    res.status(500).send({ message: "Failed to get profile" });
                }
                else {
                    res.status(200).send(profile);
                }
            });
        }
        else {
            res.status(403).send({ message: "Unauthorized: Please login" });
        }
    }

    public putProfile = (req: Express.Request & ExpressExtensions.Request, res: Express.Response, next, params) => {
        this.logger.info({ req: req.body }, "putProfile");
        this.repository.Profile.putProfile(req.body, (error, profile) => {
            if (error) {
                this.logger.error(error, "Failed to save");
                res.status(500).send({ message: "Failed to save" });
            }
            else {
                res.send(profile);
            }
        });
    }

    public postProfile = (req: Express.Request & ExpressExtensions.Request, res: Express.Response, next, params) => {
        if (this.isLoggedIn(req)) {
            this.repository.Profile.getProfileByUserId(req.user._id, (error, result) => {
                if (error) {
                    this.logger.error(error, "Create Profile for UserId");
                }
                else {
                    if (result == null) {
                        //console.log("Profile is NULL");
                        this.repository.Profile.createProfile(new this.repository.Profile({
                            userId: req.user._id,
                            nickname: req.body.nickname,
                            birthdate: req.body.birthdate,
                            fullname: req.body.fullname,
                            logoUrl: "",
                            logoId: req.body.logoId
                        }));
                    }
                }
            });
        }
        else {
            res.status(403).send({ message: "Unauthorized! " })
        }
    }
}
