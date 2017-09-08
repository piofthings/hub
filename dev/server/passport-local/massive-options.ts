import { MassiveErrorMessages } from "./massive-error-messages";

export class MassiveOptions {
    public saltlen: number = 32;
    public iterations: number = 25000;
    public keylen: number = 512;
    public encoding: string = 'hex';
    public digestAlgorithm: string = 'sha256';
    public usernameField: string = 'username';
    public usernameUnique: boolean = true;
    public usernameQueryFields: Array<string> = new Array<string>();
    public usernameLowerCase: boolean; //todo: remove
    public hashField: string = 'hash';
    public saltField: string = 'salt';
    public limitAttempts: boolean = true;
    public lastLoginField: string = 'last';
    public attemptsField: string = 'attempts';
    public interval: number = 100;
    public maxInterval: number = 300000;
    public maxAttempts: number = Infinity;

    private errorMessages : MassiveErrorMessages = new MassiveErrorMessages();

    public findByUsername : (model, queryParameters) => void;

    public passwordValidator : (password: string, cb : (error) => void) =>  void;

    constructor() {
        // Populate username query fields with defaults if not set,
        // otherwise add username field to query fields.
        if (this.usernameQueryFields) {
            this.usernameQueryFields.push(this.usernameField);
        } else {
            this.usernameQueryFields = [this.usernameField];
        }
    }
}
