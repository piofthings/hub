import * as Express from "express";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { VerificationEmailer } from "../services/mailing/verification-emailer";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";
import { AzureUploader } from "../services/azure-storage/uploader";

var Account = require("../data/account");

export class UploadController extends BaseController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;
    uploader: AzureUploader;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.repository = new db(this.config);
        this.uploader = new AzureUploader(this.config, logger);

        this["Upload:path"] = "/uploader/files";
    }

    postUpload = (req, res, net, params) => {
        this.logger.info("Uploading file");

        try {
            req.files.forEach((file) => {
                this.logger.info({ file: file }, "Uploading file");
                let newContent = new this.repository.Content({
                    ownerId: req.user._id,
                    name: file.name,
                    url: file.url,
                    filetype: file.filetype,
                    assetetag: "",
                    lastupdated: new Date(),
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                });
                this.repository.Content.create(newContent, (error) => {
                    this.logger.info({ content: newContent }, "Uploading file");
                });
                this.uploader.saveFileToBlob(newContent._id, newContent.ownerId, file.path, (error, result) => {
                    if (error != null) {
                        this.logger.error(error, "Error: Saving file to BLOB");
                    }
                    this.repository.Content.findById(newContent._id, (err, content) => {
                        if (err) {
                            this.logger.error(err, "Content findById error");
                        }
                        content.assetetag = result.etag.toString();
                        content.save((err) => {
                            if (err) {
                                this.logger.error(err, "Error saving Content in DB");
                            }
                            res.status(200).send(content);
                        });
                    });

                    
                });
            });
        }
        catch (error) {
            this.logger.error(error, "upload-controller: Unhandled error in upload-controller");
        }
    }
}
