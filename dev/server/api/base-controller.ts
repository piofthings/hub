import * as bunyan  from "bunyan";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { ApiController } from "./api-controller";

export class BaseController implements ApiController{
    authenticator: PassportLocalAuthenticator;
    logger: bunyan;
    constructor(auther: PassportLocalAuthenticator, logger: any){
        this.authenticator = auther;
        this.logger = logger;
    }

    public getLogger() {
        return this.logger;
    }

    public isLoggedIn = (req: Express.Request): boolean =>{
        if(req.user != null && req.user._id != null && req.user._id != '')
        {
            return true;
        }
        return false;
    }
}
