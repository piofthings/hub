
import * as bunyan  from "bunyan";
import * as bodyParser from "body-parser";
//import * as passport from "passport-local";

export interface Request {
    logger: bunyan;
    body: any;
    files: Array<any>;
    send: (response: any) => void;
    session: any;
    user: any;
    login: (auth: any, result: (err: Error) => void) => void;
    logout: () => void;
}
