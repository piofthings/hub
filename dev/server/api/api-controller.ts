import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";

export interface ApiController{
    authenticator : PassportLocalAuthenticator;
    getLogger(): any;
}
