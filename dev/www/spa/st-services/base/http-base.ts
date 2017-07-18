var RSVP = require("RSVP");
export class HttpBase {
    // private serviceName: string;
    private serviceType: string;
    private serviceUrl: string;
    private successCb;
    private failureCb;
    private client = new XMLHttpRequest();
    private promise;

    constructor(serviceType: string, servicesUrl: string, success, failure) {
        this.serviceType = serviceType;
        this.serviceUrl = servicesUrl;
        this.successCb = success;
        this.failureCb = failure;
    }

    public getPromise = (data: any) => {
        let RSVP = require("RSVP");
        let promise = new RSVP.Promise((resolve, reject) => {
            let client = new XMLHttpRequest();

            client.open(this.serviceType, this.serviceUrl);
            client.onload = handler;
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.setRequestHeader("Content-Type", "application/json");

            function handler() {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        resolve(this.response);
                    }
                    else {
                        reject(this);
                    }
                }
            };
            client.send(JSON.stringify(data));
            
        });
        return promise;
    }

    public execute = (data?: any) => {
        let RSVP = require("RSVP");
        let promise = new RSVP.Promise((resolve, reject) => {
            let client = new XMLHttpRequest();
            //console.log("Service Type:" + this.serviceType + "; Service URL:" + this.serviceUrl)
            client.open(this.serviceType, this.serviceUrl);
            client.onload = handler;
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.setRequestHeader("Content-Type", "application/json");

            function handler() {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        resolve(this.response);
                    }
                    else {
                        reject(this);
                    }
                }
            };
            client.send(JSON.stringify(data));

        });

        promise.then((json) => {
            // continue
            //console.log("HTTPBASE THEN:"+ JSON.stringify(json));
            this.successCb(json);
        }, (error) => {
            // handle errors
            //console.log("HTTPBASE ERROR:"+ JSON.stringify(error));
            this.failureCb(error);
        });
    }
}
