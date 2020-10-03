import * as nconf from "nconf";
import { Configuration } from "./server/services/settings/config-model";
import { Config } from "./server/services/settings/config";
import { Container } from "./server/di/container";
import { CrossRouter } from "./server/services/routing/cross-router";
import { PassportLocalAuthenticator } from "./server/services/passport-local/passport-local-authenticator";
import { SpaEngine } from "./spa-engine";
import { PassportLocalMassive } from "./server/passport-local/massive-strategy";
import { Repository } from "./server/data/pg/repository";
import * as passport from "passport";
import * as express from "express";
import * as fs from "fs";
import * as bunyan from "bunyan";
import { Strategy, VerifyFunctionWithRequest, IVerifyOptions } from "passport-local";
import { MassiveSessionStore } from "./server/session-store/massive-session-store";

var multer = require('multer');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');

var app: express.Application = express();
var http = require('http');
var https = require('https');

export class main {
    logger: bunyan;
    config: Config;
    repo: Repository;
    constructor() {
        this.logger = bunyan.createLogger({
            name: 'piothub.local',
            serializers: {
                req: bunyan.stdSerializers.req,     // standard bunyan req serializer
                err: bunyan.stdSerializers.err      // standard bunyan error serializer
            },
            streams: [
                {
                    level: 'info',                  // logging level
                    path: __dirname + '/logs/foo.log'
                }
            ]
        });
        this.config = new Config(this.logger);

    }

    public start = async () => {
        try {
            let repository = new Repository();
            this.config.load(async (configuration: Configuration) => {
                let initSuccess = await repository.init(configuration);
                if (initSuccess) {
                    Container.apiRouter = new CrossRouter("/api");
                    Container.webRouter = new CrossRouter();
                    Container.inject(configuration, <PassportLocalAuthenticator>null, this.logger);
                    console.log("Container injected");

                    app.use(bodyParser.json());
                    app.use(bodyParser.urlencoded({ extended: false }));
                    app.use(bodyParser.json());
                    app.use(bodyParser.urlencoded({ extended: false }));

                    let massiveSessionStore = new MassiveSessionStore({}, configuration);

                    app.use(session({
                        cookie: {
                            maxAge: 3600000
                        },
                        secret: configuration.sessionSecret,
                        saveUninitialized: true,
                        resave: true,
                        store: massiveSessionStore
                    }));

                    // Configure passport middleware
                    app.use(passport.initialize());
                    app.use(passport.session());

                    // Configure passport-local to use account model for authentication
                    let passportLocalMassiveStrategy = new PassportLocalMassive({
                        usernameField: 'email',
                        passwordField: 'pass'
                    }, configuration);
                    passport.use(passportLocalMassiveStrategy);
                    passport.serializeUser(passportLocalMassiveStrategy.serializeUser);
                    passport.deserializeUser(passportLocalMassiveStrategy.deserializeUser);

                    app.use('/', (req: any, res, next) => {                        
                        req.logger = this.logger;
                        console.log("Request Path:" + req.path);
                        next();
                    });

                    // Register routes
                    app.use('/.well-known', express.static(__dirname + '/www/.well-known')); //static route for Letsencrypt validation
                    app.use(express.static(__dirname + '/www')); // All static stuff from /app/wwww

                    // SpaEngine - Handle server side requests by rendering the same index.html pages
                    // for all routes

                    var spaEngine = new SpaEngine(configuration);
                    app.set('views', __dirname + '/www');
                    app.set("view options", { layout: false });
                    app.engine('html', spaEngine.renderer);
                    app.set('view engine', 'html');
                    // All HTTP API requests
                    app.use('/api', Container.apiRouter.route);
                    // All content requests that are not in static
                    app.use('/', Container.webRouter.route);

                    // catch 404 and forward to error handler
                    app.use(function (req: Express.Request, res: Express.Response, next: any) {
                        var err = new Error('Not Found');
                        err.message = "404";
                        next(err.message + ": Unhandled Error");
                    });

                    // catch 404 and forward to error handler
                    app.use(function (req, res, next) {
                        console.log("404 on :" + req.path);
                        var err = new Error('Not Found');
                        err['status'] = 404;
                        err['message'] = "Request path  : " + req.path;
                        next(err);
                    });

                    // error handlers
                    // development error handler
                    // will print stacktrace
                    if (app.get('env') === 'development') {
                        app.use((err: any, req: express.Request, res: express.Response, next: any) => {
                            res.status(err.status || 500);
                            next(err.status || 500 + ": Unhandled Error :" + JSON.stringify(err));
                        });
                    }

                    // production error handler
                    // no stacktraces leaked to user
                    app.use((err: any, req: express.Request, res: express.Response, next: any) => {
                        res.status(err.status || 500);
                        console.log("404 on :" + req.path);

                        next(err.status || 500 + ": Unhandled Error : PROD:" + JSON.stringify(err));
                        this.logger.error(err);
                    });

                    var pkg = require('./package.json');
                    var httpServer = http.createServer(app);
                    httpServer.listen(3002, (): void => {
                        console.log(pkg.name, 'listening on port ', httpServer.address().port);
                    });

                }
            });

        }
        catch (err) {
            "Outer catch:" + console.error(err);
        }

    }
}

let application = new main();
(async () => { await application.start(); })();
