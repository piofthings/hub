/*
    Session storage for express-session using Massive JS library to connect to
    PostgreSQL
*/

import { Store } from "express-session";
import { Configuration } from "../services/settings/config-model";
import { Repository } from "../../server/data/pg/repository";

export class MassiveSessionStore extends Store
{
    private config: Configuration;
    private tableName: string = 'massive_sessions';
    private oneDay: number = 86400000;

    private getExpiry = (sess) : Date =>
    {
        let maxAge = sess.cookie.maxAge;
        let now = new Date().getTime();
        var myDate = new Date();
        let expired = new Date(myDate.setTime( myDate.getTime() + 1 * 86400000 ));
        return expired;
    }

    constructor(options, con: Configuration)
    {
        super(options);
        this.config = con;
        if(options.tablename != null && options.tablename != ''){
            this.tableName = options.tablename;
        }
        this.createSessionTable(this.tableName);
    }

    private createSessionTable = (tableName: string) : Promise<Object[]>=> {
        console.log("Checking for session table:"  + tableName);
        return Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'smarthome' AND tablename = $1)", [tableName])
        .then((result: any)=>{
            console.log("Session Table: " + JSON.stringify(result));

            if(result.length > 0 && result[0].exists == false) {
                return Repository.getDb().query(`CREATE TABLE public.${tableName} (sid character varying(255) NOT NULL, sess json NOT NULL, expired timestamp with time zone NOT NULL, CONSTRAINT ${tableName}_pkey PRIMARY KEY (sid));`, [])
                .then( create =>{
                    console.log("Session Table created: " + JSON.stringify(create));
                    return create;
                })
                .catch( error =>  {
                    console.log("ERROR CREATING TABLE:" + JSON.stringify(error));
                    return null;
                });
            }
            return result;
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    public all = (callback: (err, data)=> void) => {
        console.log("session: all");
        Repository.getDb().query(`SELECT * FROM public.${this.tableName};`, [])
        .then((data)=>{
            callback(null, data);
        });
    }

    public destroy = (sessionId: string, callback: (err, data)=> void) =>{
        console.log("session: destroy");
        Repository.getDb().query(`DELETE FROM public.${this.tableName} WHERE sid=$1;`, [sessionId])
        .then((data)=>{
            callback(null, data);
        })
        .catch((error)=>{
            callback(error, null);
        });
    }

    public clear = (callback:(err, data)=>void) =>{
        console.log("session: clear");
        Repository.getDb().query(`DELETE FROM public.${this.tableName}`, [])
        .then((data) => {
            callback(null, data);
        })
        .catch(error => {
            callback(error, null);
        });
    }

    public length = (callback:(err, data)=>void) => {
        console.log("session: clear");
        Repository.getDb().query(`SELECT COUNT (*) FROM public.${this.tableName}`, [])
        .then((data) => {
            callback(null, data);
        })
        .catch(error => {
            callback(error, null);
        });
    }

    public get = (sessionId: string, callback: (err, data) => void) => {
        console.log("session: get:" + sessionId);
        Repository.getDb().query(`SELECT * FROM ${this.tableName} WHERE sid=$1`, [sessionId])
        .then((data : Array<MassiveSessionStore.Session>) => {
            console.log(JSON.stringify(data));
            if(data.length > 0){
                console.log("get success: " + JSON.stringify(data[0].sess))

                callback(null, data[0].sess);
            }
            else {
                callback(null, "");
            }
        })
        .catch(error => {
            console.log(".get bombed!");
            callback(error, null);
        });
    }

    public set = (sessionId: string, session: any, callback: (err, data)=> void) => {
        console.log(`session set: ${sessionId}` );
        Repository.getDb().query(`SELECT * FROM ${this.tableName} WHERE sid=$1`, [sessionId])
        .then(data => {
            if(data.length > 0){
                // update
                let result = <MassiveSessionStore.Session>data[0];
                Repository.getDb().query(`UPDATE ${this.tableName} SET sess = $1 WHERE sid=$2` , [session, sessionId])
                .then( result => {
                    callback (null, result);
                })
                .catch( error => {
                    console.log(".set (data.length > 1) bombed!");

                    callback (error, null);
                });
            }
            else{
                // insert
                let result = <MassiveSessionStore.Session>data[0];
                Repository.getDb().query(`INSERT INTO ${this.tableName} (sid, sess, expired) VALUES ($1, $2, $3)` , [sessionId, session, this.getExpiry(session)])
                .then( result => {
                    callback (null, result);
                })
                .catch( error => {
                    console.log(".set (data.length == 0) bombed!");
                    callback (error, null);
                });
            }
        })
        if(callback != null){
            callback(null, {});
        }
    }

    public touch = (sessionId: string, session: Express.SessionData, callback: (err)=>void) => {
        console.log("session: touch");
        Repository.getDb().query(`SELECT * FROM ${this.tableName} WHERE sid=$1`, [sessionId])
        .then(data => {
            if(data.length > 0){
                // update
                let result = <MassiveSessionStore.Session>data[0];
                Repository.getDb().query(`UPDATE ${this.tableName} SET session=$1, expired = $2 WHERE sid=$3` , [JSON.stringify(session), this.getExpiry(session), sessionId])
                .then( result => {
                    callback (null);
                })
                .catch( error => {
                    console.log(".set (data.length > 1) bombed!");
                    callback (error);
                });
            }
            else{
                // insert
                let result = <MassiveSessionStore.Session>data[0];
                Repository.getDb().query(`INSERT INTO ${this.tableName} (sid, sess, expired) VALUES ($1, $2, $3)` , [sessionId, JSON.stringify(session), this.getExpiry(session)])
                .then( result => {
                    callback (null);
                })
                .catch( error => {
                    console.log(".set (data.length == 0) bombed!");
                    callback (error);
                });
            }
        })
        if(callback != null){
            callback(null);
        }
    }
}
