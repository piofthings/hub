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
            this.initializeDatabase(callback);
        }).catch((err) => {
            console.log(err);
        });
    }

    private static initializeDatabase = (callback)=>{
        Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)", ['capabilities_master'])
        .then((result: any)=>{
            console.log("control_units Table: " + JSON.stringify(result));
            if(result.length > 0 && result[0].exists == false) {
                Repository.getDb().query(`CREATE TABLE
                    public.capabilities_master (
                        id BIGSERIAL NOT NULL,
                        name varchar,
                        CONSTRAINT capabilities_master_pkey PRIMARY KEY (id));`, [])
                .then( create =>{
                    console.log("capabilities_master created: " + JSON.stringify(create));
                    return create;
                })
                .catch( error =>  {
                    console.log("ERROR CREATING TABLE capabilities_master:" + JSON.stringify(error));
                    return null;
                })
            }
            return result;
        })
        .then((data) => {
            let tableName = 'control_units';

            Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)", [tableName])
            .then((result: any)=>{
                console.log("control_units Table: " + JSON.stringify(result));

                if(result.length > 0 && result[0].exists == false) {
                    Repository.getDb().query(`CREATE TABLE
                        public.${tableName} (
                            id BIGSERIAL NOT NULL,
                            deviceId BIGINT,
                            description varchar,
                            status integer,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, [])
                    .then( create =>{
                        console.log("Session Table created: " + JSON.stringify(create));
                        return create;
                    })
                    .catch( error =>  {
                        console.log("ERROR CREATING TABLE:" + JSON.stringify(error));
                        return null;
                    })
                }
                return result;
            })
            .catch( error =>  {
                console.log("ERROR CREATING TABLE:" + JSON.stringify(error));
                return null;
            })
        })
        .then((data)=>{
            let tableName = 'cu_capabilities';
            Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)", [tableName])
            .then((result: any)=>{
                console.log(`${tableName} Table: ` + JSON.stringify(result));

                if(result.length > 0 && result[0].exists == false) {
                    Repository.getDb().query(`CREATE TABLE
                        public.${tableName} (
                            id BIGSERIAL NOT NULL,
                            cuId BIGINT references control_units(id),
                            cmId BIGINT references capabilities_master(id),
                            gpioPin integer,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, [])
                    .then( create =>{
                        console.log(`${tableName} created: ` + JSON.stringify(create));
                        return create;
                    })
                    .catch( error =>  {
                        console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
                        return null;
                    })
                }
                return result;
            })
            .catch( error =>  {
                console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
                return null;
            })
        })
        .then((data)=>{
            let tableName = 'cu_capability_actions';
            Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)", [tableName])
            .then((result: any)=>{
                console.log("control_units Table: " + JSON.stringify(result));

                if(result.length > 0 && result[0].exists == false) {
                    Repository.getDb().query(`CREATE TABLE
                        public.${tableName} (
                            id BIGSERIAL NOT NULL,
                            ccId BIGINT references cu_capabilities(id),
                            name varchar,
                            dependencies json NOT NULL,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, [])
                    .then( create =>{
                        console.log(`${tableName} created: ` + JSON.stringify(create));
                        return create;
                    })
                    .catch( error =>  {
                        console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
                        return null;
                    })
                }
                return result;
            })
            .catch( error =>  {
                console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
                return null;
            })
        })
        .then((data)=>{
            let tableName = 'cu_ca_states';
            Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = $1)", [tableName])
            .then((result: any)=>{
                console.log("control_units Table: " + JSON.stringify(result));

                if(result.length > 0 && result[0].exists == false) {
                    Repository.getDb().query(`CREATE TABLE
                        public.${tableName} (
                            id BIGSERIAL NOT NULL,
                            cuId BIGINT references control_units(id),
                            ccaId BIGINT references cu_capability_actions(id),
                            gpioPin INT NOT NULL,
                            state json NOT NULL,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, [])
                    .then( create =>{
                        console.log(`${tableName} created: ` + JSON.stringify(create));
                        return create;
                    })
                    .catch( error =>  {
                        console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
                        return null;
                    })
                }
                return result;
            })
            .catch( error =>  {
                console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
                return null;
            })
        })
        .then((data)=>{
            if(callback!=null){
                callback();
            }
        });
    }

    public static getDb = () : massive.Database =>{
        return Repository.db;
    }

    public static accounts = (): massive.Table<MassiveStrategy.User> => {
        return (<DatabaseEx>Repository.db).accounts;
    }

    public static sessions = (): massive.Table<MassiveSessionStore.Session> => {
        return (<DatabaseEx>Repository.db).sessions_massive;
    }
}
