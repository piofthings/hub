/*
    Session storage for express-session using Massive JS library to connect to
    PostgreSQL
*/

import { Store } from "express-session";
import { Configuration } from "../services/settings/config-model";
import { Repository } from "../../server/data/pg/repository";

export class MassiveSessionStore extends Store {
    private config: Configuration;

    private schemaName = "smarthome";
    private tableName: string = 'massive_sessions';
    private oneDay: number = 86400000;

    private getExpiry = (sess): Date => {
        let maxAge = sess.cookie.maxAge;
        let now = new Date().getTime();
        var myDate = new Date();
        let expired = new Date(myDate.setTime(myDate.getTime() + 1 * 86400000));
        return expired;
    }

    constructor(options, con: Configuration) {
        super(options);
        this.config = con;
        if (options.tablename != null && options.tablename != '') {
            this.tableName = options.tablename;
        }
    }


    public all = (callback: (err, data) => void) => {
        console.log("session: all");
        Repository.getDb().query(`SELECT * FROM ${this.schemaName}.${this.tableName};`, [])
            .then((data) => {
                callback(null, data);
            });
    }

    public destroy = (sessionId: string, callback: (err, data) => void) => {
        console.log("session: destroy");
        Repository.getDb().query(`DELETE FROM ${this.schemaName}.${this.tableName} WHERE sid=$1;`, [sessionId])
            .then((data) => {
                callback(null, data);
            })
            .catch((error) => {
                callback(error, null);
            });
    }

    public clear = (callback: (err, data) => void) => {
        console.log("session: clear");
        Repository.getDb().query(`DELETE FROM ${this.schemaName}.${this.tableName}`, [])
            .then((data) => {
                callback(null, data);
            })
            .catch(error => {
                callback(error, null);
            });
    }

    public length = (callback: (err, data) => void) => {
        console.log("session: clear");
        Repository.getDb().query(`SELECT COUNT (*) FROM ${this.schemaName}.${this.tableName}`, [])
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
            .then((data: Array<MassiveSessionStore.Session>) => {
                console.log(JSON.stringify(data));
                if (data.length > 0) {
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

    public set = (sessionId: string, session: any, callback: (err, data) => void) => {
        console.log(`session set: ${sessionId}`);
        Repository.getDb().query(`SELECT * FROM ${this.schemaName}.${this.tableName} WHERE sid=$1`, [sessionId])
            .then(data => {
                if (data.length > 0) {
                    // update
                    let result = <MassiveSessionStore.Session>data[0];
                    Repository.getDb().query(`UPDATE ${this.schemaName}.${this.tableName} SET sess = $1 WHERE sid=$2`, [session, sessionId])
                        .then(result => {
                            callback(null, result);
                        })
                        .catch(error => {
                            console.log(".set (data.length > 1) bombed!");

                            callback(error, null);
                        });
                }
                else {
                    // insert
                    let result = <MassiveSessionStore.Session>data[0];
                    Repository.getDb().query(`INSERT INTO ${this.schemaName}.${this.tableName} (sid, sess, expired) VALUES ($1, $2, $3)`, [sessionId, session, this.getExpiry(session)])
                        .then(result => {
                            callback(null, result);
                        })
                        .catch(error => {
                            console.log(".set (data.length == 0) bombed!");
                            callback(error, null);
                        });
                }
            })
            .catch(error => {
                console.log(".set bombed!");
                callback(error, null);
            });

        if (callback != null) {
            callback(null, {});
        }
    }

    public touch = (sessionId: string, session: Express.SessionData, callback: (err) => void) => {
        console.log("session: touch");
        Repository.getDb().query(`SELECT * FROM ${this.schemaName}.${this.tableName} WHERE sid=$1`, [sessionId])
            .then(data => {
                if (data.length > 0) {
                    // update
                    let result = <MassiveSessionStore.Session>data[0];
                    Repository.getDb().query(`UPDATE ${this.schemaName}.${this.tableName} SET session=$1, expired = $2 WHERE sid=$3`, [JSON.stringify(session), this.getExpiry(session), sessionId])
                        .then(result => {
                            callback(null);
                        })
                        .catch(error => {
                            console.log(".set (data.length > 1) bombed!");
                            callback(error);
                        });
                }
                else {
                    // insert
                    let result = <MassiveSessionStore.Session>data[0];
                    Repository.getDb().query(`INSERT INTO ${this.schemaName}.${this.tableName} (sid, sess, expired) VALUES ($1, $2, $3)`, [sessionId, JSON.stringify(session), this.getExpiry(session)])
                        .then(result => {
                            callback(null);
                        })
                        .catch(error => {
                            console.log(".set (data.length == 0) bombed!");
                            callback(error);
                        });
                }
            })
            .catch(error => {
                console.log(".touch bombed!");
                callback(error);
            });
        if (callback != null) {
            callback(null);
        }
    }
}
