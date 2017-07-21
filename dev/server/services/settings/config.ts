import { Configuration } from "./config-model";
import * as nconf from 'nconf';
import fs = require('fs');

export class Config {

    public currentSettings = new Configuration();
    private logger: any;

    constructor(logger: any)
    {
        this.logger = logger;
    }

    public load = (callback: (currentSettings: Configuration) => void) =>
    {
        try
        {
            nconf.file('./webconfig.json');
            nconf.load((data) =>
            {
                this.currentSettings.verifyFromEmail = nconf.get('verifyFromEmail');
                this.currentSettings.sparkPostApiKey = nconf.get('sparkPostApiKey');
                this.currentSettings.mongodbDataUri = nconf.get('mongodbDataUri');
                this.currentSettings.mongodbMqttUri = nconf.get('mongodbMqttUri');
                this.currentSettings.sessionSecret = nconf.get('sessionSecret');
                this.currentSettings.azureStorageConnectionString = nconf.get('azureStorageConnectionString');
                this.currentSettings.containerName = nconf.get('containerName');
                this.currentSettings.key = nconf.get('key');
                this.currentSettings.cert = nconf.get('cert');
                if(callback!=null)
                {
                    callback(this.currentSettings);
                }
            });
        }
        catch(error)
        {
            //console.log(error);
            this.logger.error(error,  "Error loading config");

        }
    }

    public set = (name: string, value: any) =>
    {
        nconf.set(name, value);
        (<any>this.currentSettings)[name] = <any>value;
    }

    public get = () =>
    {
        return this.currentSettings;
    }

    public saveSettings = (settings: Configuration) =>
    {
        let keys = Object.keys(settings);
        keys.forEach((key) => {
            nconf.set(key, settings[key]);
        });
        this.save();
    }

    public save = () =>
    {
        nconf.save((err: any) => {
            fs.readFile('./config.json', (err, data) => {
                console.dir(JSON.parse(data.toString()))
            });
        });
    }
}
