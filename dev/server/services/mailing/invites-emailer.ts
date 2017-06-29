import { Configuration } from "../settings/config-model";
var SparkPost = require('sparkpost');

export class InvitesEmailer {
    client: any;
    config: Configuration;
    constructor(configuration: Configuration) {
        this.config = configuration;
        this.client = new SparkPost(configuration.sparkPostApiKey);
    }

    public sendEmail = () =>{
        
    }
}
