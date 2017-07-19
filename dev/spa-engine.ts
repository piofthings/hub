import { Configuration } from "./server/services/settings/config-model";
export class SpaEngine {
    private configuration: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public renderer = (filename: string, options, callback) => {
        console.log("In renderer!!!! looking for " + filename + " at " + __dirname + "/www/index.html");
        let fs = require('fs');
        fs.readFile(__dirname + "/www/index.html", 'UTF8', (err, data) => {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, data);
            }
        });
    }
}
