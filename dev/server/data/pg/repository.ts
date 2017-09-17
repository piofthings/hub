import * as massive from "massive";
import { Configuration } from "../../services/settings/config-model";
//import "massive-mapping";

export class Repository
{
    private static db: massive.Database | DatabaseEx;

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

    public static accounts = () => {
        return (<DatabaseEx>Repository.db).accounts;
    }

    public static sessions = () => {
        return (<DatabaseEx>Repository.db).sessions_massive;
    }
}
