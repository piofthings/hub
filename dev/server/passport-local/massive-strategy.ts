import * as crypto from 'crypto';
import * as passport from "passport";
import * as express from "express";
import { Database } from 'massive';
import { Repository } from "../data/pg/repository";
import { Configuration } from "../services/settings/config-model";
import { Strategy, VerifyFunctionWithRequest, IVerifyOptions } from "passport-local";
import { MassiveOptions } from "./massive-options";

export class PassportLocalMassive extends Strategy {
    private options: MassiveOptions = new MassiveOptions();

    private schemaName: string = "smarthome";
    private tableName: string = "accounts";
    public db: Database;

    constructor(userPassFields: any, config: Configuration) {
        super(userPassFields, (req: express.Request, username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): void => {
            this.authenticate(username, password);
        });

    }
   
    public authenticate(username, password) {
        return true;
    }

    public deserializeUser = async (id, done): Promise<MassiveStrategy.User> => {
        console.debug("deserialize ", id);
        try {
            let user = await <MassiveStrategy.User>Repository.getDb().query(`SELECT id, username, email, isverified FROM ${this.tableName} 
              WHERE user_id = $1`, [id]);
            if (user != null) {
                console.debug("deserializeUser ", user);
                return user;
            }
            else {
                return null;
            }
        }
        catch (exception) {
            console.log("deseraliseUser Failed: " + JSON.stringify(exception));
        }
    }

    public serializeUser = (user: MassiveStrategy.User, done) => {
        console.debug("serialize ", user);
        done(null, user.id);
    }

    public login = async (username, password, done): Promise<MassiveStrategy.User> => {
        console.debug("Login process:", username);
        try {
            let user = await Repository.getDb().query(`SELECT id, username, email 
                FROM ${this.tableName} 
                WHERE username=$1`, [username]);
            if (user != null) {
                if (this.authenticate(username, password)) {
                    return user;
                }
                else {
                    return null;
                }
            }
        }
        catch (err) {
            console.error("/login: " + err);
            return done(null, false, { message: 'Wrong user name or password' });
        }
    }
}
