import * as nconf from "nconf";
import { Configuration } from "./server/services/settings/config-model";
import { Config } from "./server/services/settings/config";

import * as express from "express";
import * as fs from "fs";
import * as bunyan from "bunyan";

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
    constructor() {
        this.logger = bunyan.createLogger({
            name: 'piothub.local',
            serializers: {
                req: bunyan.stdSerializers.req,     // standard bunyan req serializer
                err: bunyan.stdSerializers.err      // standard bunyan error serializer
            },
            streams: [
                {
                    level: 'info',                  // loging level
                    path: __dirname + '/logs/foo.log'
                }
            ]
        });
        this.config = new Config(this.logger);

    }

    public start = () => {
        try {
            this.config.load((config: Configuration) => {
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: false }));

                // Register routes
                app.use('/.well-known', express.static(__dirname + '/www/.well-known')); //static route for Letsncrypt validation
                app.use(express.static(__dirname + '/www')); // All static stuff from /app/wwww

                // catch 404 and forward to error handler
                app.use(function(req: Express.Request, res: Express.Response, next: any) {
                    var err = new Error('Not Found');
                    err.message = "404";
                    next(err.message + ": Unhandled Error");
                });

                // error handlers
                // development error handler
                // will print stacktrace
                if (app.get('env') === 'development') {
                    app.use((err: any, req: express.Request, res: express.Response, next: any) => {
                        res.status(err.status || 500);
                        next(err.status || 500 + ": Unhandled Error" + err.message);
                    });
                }

                // production error handler
                // no stacktraces leaked to user
                app.use((err: any, req: express.Request, res: express.Response, next: any) => {
                    res.status(err.status || 500);
                    next(err.status || 500 + ": Unhandled Error");
                });

                var pkg = require('./package.json');
                var httpServer = http.createServer(app);
                httpServer.listen(3002, (): void => {
                    console.log(pkg.name, 'listening on port ', httpServer.address().port);
                });

            });

        }
        catch (err) {
            "Outer catch:" + console.error(err);
        }
    }
}

let application = new main();
application.start();
