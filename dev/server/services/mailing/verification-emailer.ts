import { Configuration } from "../settings/config-model";
var SparkPost = require('sparkpost');

export class VerificationEmailer {
    client: any;
    config: Configuration;
    constructor(configuration: Configuration) {
        this.config = configuration;
        this.client = new SparkPost(configuration.sparkPostApiKey);
    }

    public sendEmail = (verificationCode: string, emailAddress: string, cb) => {
        this.client.transmissions.send({
            transmissionBody: {
                content: {
                    from: this.config.verifyFromEmail,
                    subject: 'Please verify your email address | sumitmaitra.com',
                    html: '<html><body><p>Thank you for signing up with sumitmaitra.com. To access your account please verify your email address by click on the following link - https://sumitmaitra.com/verify/' + verificationCode + '</p></body></html>'
                },
                recipients: [
                    { address: emailAddress }
                ]
            }
        }, (err, res) => {
            if (err) {
                //console.log('Whoops! Something went wrong');
                //console.log(err);
                if (cb != null) {
                    cb(err, null);
                }
            } else {
                //console.log('Verification email sent!');
                if (cb != null) {
                    cb(null, null);
                }
            }
        });
    }
}
