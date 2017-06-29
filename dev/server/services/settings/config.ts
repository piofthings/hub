import { Configuration } from "./config-model";
import nconf = require('nconf');
import fs = require('fs');

export class Config {

    public currentSettings = new Configuration();

    constructor()
    {
    }

    public load(callback: (currentSettings: Configuration) => void) : void
    {
        try
        {
            nconf.file('./webconfig.json');
            nconf.load((data) =>
            {
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
        }
    }

    public set(name: string, value: any): void
    {
        nconf.set(name, value);
        (<any>this.currentSettings)[name] = <any>value;
    }

    public get() : Configuration
    {
        return this.currentSettings;
    }

    public saveSettings(settings: Configuration) : void
    {
        let keys: Array<string> = Object.keys(<any>settings);
        keys.forEach((key: any) => {
            nconf.set(key, (<any>settings)[key]);
        });
        this.save();
    }

    public save() : void
    {
        nconf.save((err: any) => {
            fs.readFile('./config.json', (err, data) => {
                console.dir(JSON.parse(data.toString()))
            });
        });
    }
}
