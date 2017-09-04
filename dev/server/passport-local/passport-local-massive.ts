import * as crypto from 'crypto';
import * as passport from "passport";
import { Repository } from "../data/pg/repository";
import { Configuration } from "../services/settings/config-model";
import { Strategy, VerifyFunctionWithRequest } from "passport-local";

export class PassportLocalMassive extends Strategy
{
    constructor(userPassFields: any, verifyFunction: VerifyFunctionWithRequest, config: Configuration, )  {
        super(userPassFields, verifyFunction);
    }

    public authenticate = (username, password) =>{

    }

    public deserializeUser = (id, done) => {
      console.debug("deserialize ", id);

      Repository.getDb().run("SELECT user_id, user_name, user_email, user_role FROM users " +
              "WHERE user_id = $1", [id])
      .then((user)=>{
        console.debug("deserializeUser ", user);
        done(null, user);
      })
      .catch((err)=>{
        done(new Error(`User with the id ${id} does not exist`));
      })
    }

    public serializeUser = (user: User, done)=>{
        console.debug("serialize ", user);
        done(null, user.user_id);
    }

    public login = (username, password, done) => {
      console.debug("Login process:", username);
      return Repository.getDb().run("SELECT user_id, user_name, user_email, user_role " +
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
