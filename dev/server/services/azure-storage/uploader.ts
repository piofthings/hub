import { Configuration } from "../settings/config-model";
let azure = require("azure-storage");

export class AzureUploader {
    private configuration: Configuration;
    logger: any;

    constructor(configuration: Configuration, logr: any) {
        this.configuration = configuration;
        this.logger = logr;
    }

    public saveFileToBlob = (id: string, owner: string, localFileName: string, callback) => {
        //console.log("Before Service Created" + id + "content: " + localFileName);
        try {
            var blobSvc = azure.createBlobService(this.configuration.azureStorageConnectionString);
            blobSvc.createContainerIfNotExists(this.configuration.containerName, null, (error, result, response) => {
                if (!error) {
                    blobSvc.createBlockBlobFromLocalFile(this.configuration.containerName, owner + '/' + id, localFileName, (error, result, response) => {
                        if (!error) {
                            //console.log("File Result: " + JSON.stringify(result));
                            callback(null, result);
                        }
                        else {
                            this.logger.error(error, "Failed to create blob");

                            //console.log("Failed to create blob " + JSON.stringify(error));
                        }
                    });
                }
                else {
                    this.logger.debug({ error: error }, "Failed to create container: ");
                }
            });
        }
        catch (err) {
            this.logger.error(err, "Unhandled error in saveFileToBlob!");
        }
    }
}
