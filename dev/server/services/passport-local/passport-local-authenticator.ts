import * as Express from "express-serve-static-core";
import { Configuration } from "../settings/config-model";

//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

export class PassportLocalAuthenticator {
    private app: Express.Application;
    private configuration: Configuration;

    public passport: any;
    constructor(app: Express.Application, passport: any, config: Configuration) {
        this.passport = passport;
        let Account = require('../../data/account');
        this.configuration = config;
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new LocalStrategy(Account.authenticate));
        passport.serializeUser(Account.serializeUser());
        passport.deserializeUser(Account.deserializeUser());
    }
}
