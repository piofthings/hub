import * as massive from "massive";
import { Configuration } from "../../services/settings/config-model";

export class Repository
{
    private static db: massive.Database;

    public static init(config: Configuration, callback: ()=>void){
        massive(config.webSessionConfig.connection).then((db) => {
            Repository.db = db;
            console.log("Repository initialized: " + JSON.stringify(config.webSessionConfig.connection));
            callback();
        }).catch((err) => {
            console.log(err);
        });
    }

    public static getDb = () : massive.Database =>{
        return Repository.db;
    }
}
