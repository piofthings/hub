import * as crypto from 'crypto';
import * as passport from "passport";
import * as express from "express";
import { Database } from 'massive';
import { Repository } from "../data/pg/repository";
import { Configuration } from "../services/settings/config-model";
import { Strategy, VerifyFunctionWithRequest, IVerifyOptions } from "passport-local";
import { MassiveOptions } from "./massive-options";

export class PassportLocalMassive extends Strategy
{
    private options: MassiveOptions = new MassiveOptions();
    private tableName: string = "accounts";
    public db: Database;

    constructor(userPassFields: any, config: Configuration)  {
        super(userPassFields, (req: express.Request, username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): void => {
            this.authenticate(username, password);
        });
        this.createSessionTable(this.tableName);
    }

    private createSessionTable = (tableName: string) => {
        console.log("Checking for accounts table:"  + tableName);
        Repository.getDb().query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'smarthome' AND tablename = $1)", [tableName])
        .then((result: any)=>{
            console.log("Accounts Table: " + JSON.stringify(result));

            if(result.length > 0 && result[0].exists == false) {
                Repository.getDb().query(`CREATE TABLE
                    public.${tableName} (
                        id SERIAL NOT NULL,
                        salt varchar NOT NULL,
                        hash varchar NOT NULL,
                        username varchar NOT NULL,
                        isverified BOOLEAN NOT NULL DEFAULT FALSE,
                        email varchar,
                        verificationcode varchar NOT NULL,
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
        .catch((err)=>{
            console.log(err);
        });
    }

    public authenticate (username, password){
        return true;
    }

    public deserializeUser = (id, done) => {
      console.debug("deserialize ", id);

      Repository.getDb().query("SELECT id, username, email, isverified FROM users " +
              "WHERE user_id = $1", [id])
      .then((user)=>{
        console.debug("deserializeUser ", user);
        done(null, user);
      })
      .catch((err)=>{
        done(new Error(`User with the id ${id} does not exist`));
      })
    }

    public serializeUser = (user: MassiveStrategy.User, done)=>{
        console.debug("serialize ", user);
        done(null, user.id);
    }

    public login = (username, password, done) => {
      console.debug("Login process:", username);
      return Repository.getDb().query("SELECT user_id, user_name, user_email, user_role " +
          "FROM users " +
          "WHERE user_email=$1 AND user_pass=$2", [username, password])
        .then((result)=> {
          return done(null, result);
        })
        .catch((err) => {
          console.error("/login: " + err);
          return done(null, false, {message:'Wrong user name or password'});
        });
    }
}
