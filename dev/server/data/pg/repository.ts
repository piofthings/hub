import * as massive from "massive";
import { Configuration } from "../../services/settings/config-model";
//import "massive-mapping";

export class Repository {
    private static db: massive.Database | DatabaseEx;

    public init = async (config: Configuration): Promise<boolean> => {
        Repository.db = await massive(config.webSessionConfig.connection);
        console.log("Repository initialized: " + JSON.stringify(config.webSessionConfig.connection));
        return this.initializeDatabase();
    }

    private initializeDatabase = async (): Promise<boolean> => {
        let result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'smarthome' AND tablename = $1)", ['capabilities_master']);


        console.log("control_units Table: " + JSON.stringify(result));
        if (result.length > 0 && result[0].exists == false) {
            try {
                let create = await Repository.getDb().query(`CREATE TABLE
            smarthome.capabilities_master (
                        id BIGSERIAL NOT NULL,
                        name varchar,
                        CONSTRAINT capabilities_master_pkey PRIMARY KEY (id));`, []);
                console.log("capabilities_master created: " + JSON.stringify(create));

            }
            catch (ex) {
                console.log("ERROR CREATING TABLE capabilities_master:" + JSON.stringify(ex));
                return false;
            }
        }
        let tableName = 'control_units';

        result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'smarthome' AND tablename = $1)", [tableName]);

        if (result.length > 0 && result[0].exists == false) {
            try {
                var createResults = await Repository.getDb().query(`CREATE TABLE
                smarthome.${tableName} (
                            id BIGSERIAL NOT NULL,
                            deviceId BIGINT,
                            description varchar,
                            status integer,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);

                console.log("Session Table created: " + JSON.stringify(createResults));

            }
            catch (error) {
                console.log("ERROR CREATING TABLE:" + JSON.stringify(error));
                return false;
            }
        }
        tableName = 'cu_capabilities';
        result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'smarthome' AND tablename = $1)", [tableName])
        try {
            if (result.length > 0 && result[0].exists == false) {
                let createResults = await Repository.getDb().query(`CREATE TABLE
                smarthome.${tableName} (
                            id BIGSERIAL NOT NULL,
                            cuId BIGINT references control_units(id),
                            cmId BIGINT references capabilities_master(id),
                            gpioPin integer,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);

                console.log(`${tableName} created: ` + JSON.stringify(createResults));

            }
        }
        catch (error) {
            console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
            return false;
        }

        tableName = 'cu_capability_actions';
        result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'smarthome' AND tablename = $1)", [tableName]);
        try {
            if (result.length > 0 && result[0].exists == false) {
                let createResults = await Repository.getDb().query(`CREATE TABLE
                smarthome.${tableName} (
                            id BIGSERIAL NOT NULL,
                            ccId BIGINT references cu_capabilities(id),
                            name varchar,
                            dependencies json NOT NULL,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);

                console.log(`${tableName} created: ` + JSON.stringify(createResults));
            }
        }
        catch (error) {
            console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
            return false;
        };

        tableName = 'cu_ca_states';
        result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'smarthome' AND tablename = $1)", [tableName])

        try {
            if (result.length > 0 && result[0].exists == false) {
                let createResults = await Repository.getDb().query(`CREATE TABLE
                smarthome.${tableName} (
                            id BIGSERIAL NOT NULL,
                            cuId BIGINT references control_units(id),
                            ccaId BIGINT references cu_capability_actions(id),
                            gpioPin INT NOT NULL,
                            state json NOT NULL,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);

                console.log(`${tableName} created: ` + JSON.stringify(createResults));

            }
        }
        catch (error ){
            console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
            return false;
        }
        return true;
    }

    public static getDb = (): massive.Database => {
        return Repository.db;
    }

    public static accounts = (): massive.Table<MassiveStrategy.User> => {
        return (<DatabaseEx>Repository.db).accounts;
    }

    public static sessions = (): massive.Table<MassiveSessionStore.Session> => {
        return (<DatabaseEx>Repository.db).sessions_massive;
    }
}
