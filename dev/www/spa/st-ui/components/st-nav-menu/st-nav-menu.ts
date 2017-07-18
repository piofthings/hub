/// <amd-dependency path="text!./st-nav-menu.html"/>
import * as ko from "knockout";
import { BaseComponent } from "../st-base-component/base-component";
import { MenuItem } from "../../view-models/st-nav-menu/st-menu-item";

export var template = require("text!./st-nav-menu.html");
export class viewModel extends BaseComponent {

    userName: KnockoutObservable<string> = ko.observable<string>("");
    loggedIn: KnockoutComputed<boolean> = ko.pureComputed<boolean>(() => {
        return this.userName() !== null && this.userName() != '';
    });

    leftMenuItems: KnockoutObservable<MenuItem> = ko.observable<MenuItem>();
    rightMenuItems: KnockoutObservable<MenuItem> = ko.observable<MenuItem>();

    constructor(params) {
        super(params);
        this.id(params.id || "st-nav-menu");
        if (params.userName && params.userName()) {
            this.userName(params.userName());
        }
        if (params.leftMenuItems != null) {
            this.leftMenuItems = params.leftMenuItems;
        }
        if (params.rightMenuItems != null) {
            this.rightMenuItems = params.rightMenuItems;
        }
    }
}
