import * as Express from "express-serve-static-core";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { VerificationEmailer } from "../services/mailing/verification-emailer";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";

var passport = require('passport');

export class PassportLocalController extends BaseController {
    config: Configuration;
    mailer: VerificationEmailer;
    respository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.mailer = new VerificationEmailer(configuration);
        this.respository = new db(configuration);

        this["Register:path"] = "/accounts/register";
        this["Login:path"] = "/accounts/login";
        this["Logout:path"] = "/accounts/logout";
        this["Verify:path"] = "/accounts/verify";
        this["VerifyResend:path"] = "/accounts/verifyresend";
    }


    public getVerify = (req, res, next, params) => {
        this.logger.info({});
        //console.log("Going to GET verification user" + JSON.parse(params));
        if ((req.session.passport != null && req.session.passport.user != null)) {
            res.send({ username: req.sessions.passport.user });
        } else if (req.session.userId != null) {
            res.send({ username: req.session.username });
        } else {
            res.send({ username: 'unknown' });
        }
    }

    public postVerify = (req, res, next) => {
        //console.log("Going to POST verify");
        if (req.body.verificationcode != '' && req.body.verificationcode != null) {
            this.respository.Account.verifyAccount(req.body.verificationcode, (err, account) => {
                if (err) {
                    res.status(500).send({ message: "Verification Failed", error: err });
                } else {
                    res.status(200).send({ message: "Verification complete, please <a href='/' title='Login'>login to continue</a>", error: null });
                }
            });
        }
        else {
            res.send({ username: req.session.username, message: "" });
        }
    }

    public postVerifyResend = (req, res, next) => {
        //console.log("Going to POST resend verification email");
        if (req.session.username != null) {
            //console.log("Session UserId: " + req.session.username);
            this.respository.Account.findByUsername(req.session.username, false, (err, user) => {
                //console.log("Session Loaded User: " + user);
                if (user != null && user.email != '') {
                    //console.log(JSON.stringify(user));
                    this.mailer.sendEmail(user.verificationCode.toString(), user.email, (error, result) => {
                        if (error) {
                            res.status(500).send({ message: "Error sending verification email", error: error });
                            this.logger.error(error, "Error sending verification email");
                        }
                        else {
                            res.status(200).send({ message: "Verification email sent successfully", error: error });
                            this.logger.debug({ message: "Verification email sent successfully" });
                        }
                    });
                }
            });
        }
        else {

        }
    }

    public postRegister = (req, res, next) => {
        //console.log("Going to register");
        let code = this.respository.getNewObjectId();
        let acc = new this.respository.Account({
            username: req.body.username,
            isVerified: false,
            email: req.body.email,
            verificationCode: code
        });
        this.respository.Account.register(acc, req.body.password, (err) => {
            if (err) {
                //console.log('error while user register!', err);
                return next(err);
            }
            //console.log('user registered!');
            this.mailer.sendEmail(code.toString(), req.body.email, (error, data) => {
                res.redirect('/');
            });
        });
    }

    public postLogin = (req, res, next) => {
        //console.log("Going to sign in");
        try {
            passport.authenticate('local', (err, authResult, message) => {
                //console.log("AuthResult  :" + authResult.username);
                //console.log("Message  :" + message);

                if (authResult != false) {
                    if (authResult.isVerified) {
                        this.logger.info({ message: "Account is verified" });
                        //console.log();
                        req.login(authResult, (err) => {
                            if (err) {
                                this.logger.error(err, "POST LOGIN: Error");
                                res.redirect('/login');
                            } else {
                                res.redirect('/');
                            }
                        });
                    } else {
                        //console.log("Account is not verified");
                        this.logger.debug({ message: "Account is not verified" }, "Account is not verified");
                        req.session.username = authResult.username;
                        res.redirect('/verify')
                    };
                }
                else {
                    this.logger.error({ message: "Invalid username or password"}, "POST LOGIN: Error");

                    res.redirect('/login');
                }
            })(req, res, next);
        } catch (error) {
            //console.log(error);
            this.logger.error({ error: error, message: "Unexpected error" });

        }
    }

    public getLogin = (req, res, next) => {
        //console.log("Getting Login: " + JSON.stringify({ user: req.user }));

        res.send({ user: req.user });
    }

    public postLogout = (req, res, next) => {
        //console.log("Going to sign out: " + JSON.stringify(req.user));
        req.logout();
        res.redirect('/');
    }
}
