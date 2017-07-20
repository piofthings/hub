import "text!./room.html";
import { HttpBase } from "../../../st-services/base/http-base";
import * as ko from "knockout";

export var template = require("text!./room.html");

export class viewModel{
    postSwitchService: HttpBase;
    deviceId: KnockoutObservable<string> = ko.observable<string>("DeviceOne");
    constructor(params){
        this.postSwitchService = new HttpBase("POST", "/api/device/" + this.deviceId(), this.toggleSuccess, this.toggleFailure);
    }

    private switchOn = () => {
        this.postSwitchService.execute({ state: 'on' });
    }

    private switchOff = () => {
        this.postSwitchService.execute({ state: 'off' });
    }


    private toggleSuccess = (data)=> {

    }

    private toggleFailure = (error) => {

    }


}
