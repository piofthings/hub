import * as massive from "massive";
import { Configuration } from "../../services/settings/config-model";
//import "massive-mapping";

export class Repository {
    private static db: massive.Database | DatabaseEx;
    private schemaName: string = "";

    public init = async (config: Configuration): Promise<boolean> => {
        Repository.db = await massive(config.webSessionConfig.connection);
        console.log("Repository initialized: " + JSON.stringify(config.webSessionConfig.connection));
        this.schemaName = "smarthome";
        return this.initializeDatabase();
    }

    private initializeDatabase = async (): Promise<boolean> => {
        let tableName = 'capabilities_master';
        let result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName]);
        console.log(`${tableName}  Table: ${JSON.stringify(result)}`);
        try {
            if (result.length > 0 && result[0].exists == false) {
                let create = await Repository.getDb().query(`CREATE TABLE
                    ${this.schemaName}.${tableName} (
                    id BIGSERIAL NOT NULL,
                    name varchar,
                    CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);
                console.log(`${tableName} created: " ${JSON.stringify(create)}`);

            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (ex) {
            console.log(`ERROR CREATING TABLE ${tableName}: ${JSON.stringify(ex)}`);
            return false;
        }


        tableName = 'control_units';
        try {
            result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName]);
            if (result.length > 0 && result[0].exists == false) {
                var createResults = await Repository.getDb().query(`CREATE TABLE
                ${this.schemaName}.${tableName} (
                            id BIGSERIAL NOT NULL,
                            deviceId BIGINT,
                            description varchar,
                            status integer,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);
                console.log("Session Table created: " + JSON.stringify(createResults));

            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (error) {
            console.log(`ERROR CREATING TABLE ${tableName}: ${JSON.stringify(error)}`);
            return false;
        }
        tableName = 'cu_capabilities';
        result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName]);
        try {
            if (result.length > 0 && result[0].exists == false) {
                let createResults = await Repository.getDb().query(`CREATE TABLE
                ${this.schemaName}.${tableName} (
                            id BIGSERIAL NOT NULL,
                            cuId BIGINT references ${this.schemaName}.control_units(id),
                            cmId BIGINT references ${this.schemaName}.capabilities_master(id),
                            gpioPin integer,
                            mqttHost varchar(1000),
                            mqttPort integer,
                            mqttTopic varchar(1000),
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);

                console.log(`${tableName} created: ` + JSON.stringify(createResults));

            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (error) {
            console.log(`ERROR CREATING TABLE ${tableName}` + JSON.stringify(error));
            return false;
        }

        try {
            tableName = 'cu_capability_actions';
            result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName]);
            if (result.length > 0 && result[0].exists == false) {
                let createResults = await Repository.getDb().query(`CREATE TABLE
                ${this.schemaName}.${tableName} (
                            id BIGSERIAL NOT NULL,
                            ccId BIGINT references ${this.schemaName}.cu_capabilities(id) NOT NULL,
                            name varchar,
                            dependencies json NOT NULL,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);

                console.log(`${tableName} created: ` + JSON.stringify(createResults));
            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (error) {
            console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
            return false;
        };

        try {
            tableName = 'cu_ca_states';
            result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName]);

            if (result.length > 0 && result[0].exists == false) {
                let createResults = await Repository.getDb().query(`CREATE TABLE
                ${this.schemaName}.${tableName} (
                            id BIGSERIAL NOT NULL,
                            cuId BIGINT references ${this.schemaName}.control_units(id) NOT NULL,
                            ccaId BIGINT references ${this.schemaName}.cu_capability_actions(id) NOT NULL,
                            gpioPin INT NOT NULL,
                            state json NOT NULL,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, []);

                console.log(`${tableName} created: ` + JSON.stringify(createResults));
            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (error) {
            console.log(`ERROR CREATING ${tableName}` + JSON.stringify(error));
            return false;
        }

        try {
            tableName = 'accounts';
            console.log("Checking for accounts table:" + tableName);
            result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName])
            if (result.length > 0 && result[0].exists == false) {
                let createResults = await Repository.getDb().query(`CREATE TABLE
                    ${this.schemaName}.${tableName} (
                            id SERIAL NOT NULL,
                            salt varchar NOT NULL,
                            hash varchar NOT NULL,
                            username varchar NOT NULL,
                            isverified BOOLEAN NOT NULL DEFAULT FALSE,
                            email varchar,
                            verificationcode varchar NOT NULL,
                            CONSTRAINT ${tableName}_pkey PRIMARY KEY (id));`, [])
                console.log(`Table created ${this.schemaName}.${tableName}: ${JSON.stringify(createResults)}`);
            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (error) {
            console.log(`ERROR CREATING TABLE ${this.schemaName}.${tableName}: ${JSON.stringify(error)}`);
            return false;
        }

        try {
            tableName = "massive_sessions";
            console.log("Checking for session table:" + tableName);
            result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName])
            console.log("Session Table: " + JSON.stringify(result));
            if (result.length > 0 && result[0].exists == false) {
                let createResult = await Repository.getDb().query(`CREATE TABLE ${this.schemaName}.${tableName} (
                    sid character varying(255) NOT NULL, 
                    sess json NOT NULL, 
                    expired timestamp with time zone NOT NULL, 
                    CONSTRAINT ${tableName}_pkey PRIMARY KEY (sid));`, [])
                console.log(`Table created ${this.schemaName}.${tableName}: ${JSON.stringify(createResult)}`);
            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (err) {
            console.log(err);
            return false;
        }

        try {
            tableName = "home_config";
            console.log("Checking for session table:" + tableName);
            result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName])
            console.log("Session Table: " + JSON.stringify(result));
            if (result.length > 0 && result[0].exists == false) {
                let createResult = await Repository.getDb().query(`CREATE TABLE ${this.schemaName}.${tableName} (
                    id BIGSERIAL NOT NULL,
                    "name" varchar NOT NULL,
                    CONSTRAINT ${tableName}_pkey PRIMARY KEY (id)
                );`, [])
                console.log(`Table created ${this.schemaName}.${tableName}: ${JSON.stringify(createResult)}`);
            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (err) {
            console.log(err);
            return false;
        }

        try {
            tableName = "home_rooms";
            console.log("Checking for session table:" + tableName);
            result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName])
            console.log("Session Table: " + JSON.stringify(result));
            if (result.length > 0 && result[0].exists == false) {
                let createResult = await Repository.getDb().query(`CREATE TABLE ${this.schemaName}.${tableName} (
                    id BIGSERIAL NOT NULL,
                    homeid BIGINT references ${this.schemaName}.home_config(id) NOT NULL,
                    room_name varchar(255) NOT NULL,
                    CONSTRAINT ${tableName}_pkey PRIMARY KEY (id)
                );`, [])
                console.log(`Table created ${this.schemaName}.${tableName}: ${JSON.stringify(createResult)}`);
            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (err) {
            console.log(err);
            return false;
        }

        try {
            tableName = "home_room_control_units";
            console.log("Checking for session table:" + tableName);
            result = await Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = $1 AND tablename = $2)", [this.schemaName, tableName])
            console.log("Session Table: " + JSON.stringify(result));
            if (result.length > 0 && result[0].exists == false) {
                let createResult = await Repository.getDb().query(`CREATE TABLE ${this.schemaName}.${tableName} (
                    id BIGSERIAL NOT NULL,
                    homeroomid BIGINT references ${this.schemaName}.home_rooms(id) NOT NULL,
                    cuid BIGINT references ${this.schemaName}.control_units(id) NOT NULL,
                    CONSTRAINT ${tableName}_pkey PRIMARY KEY (id)
                );`, [])
                console.log(`Table created ${this.schemaName}.${tableName}: ${JSON.stringify(createResult)}`);
            }
            else {
                console.log(`Table ${this.schemaName}.${tableName} exists!`);
            }
        }
        catch (err) {
            console.log(err);
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
