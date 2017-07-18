import "text!./st-nav-tab.html";
import * as ko from "knockout";
import { BaseComponent } from "../st-base-component/base-component";
import { TabStrip } from "../../view-models/st-nav-tab/st-tab-strip";

export var template = require("text!./st-nav-tab.html");

export class viewModel extends BaseComponent {

    userName: KnockoutObservable<string> = ko.observable<string>("");
    loggedIn: KnockoutComputed<boolean> = ko.pureComputed<boolean>(() => {
        return this.userName() !== null && this.userName() != '';
    });

    tabStrip: KnockoutObservable<TabStrip> = ko.observable<TabStrip>(new TabStrip());

    constructor(params) {
        super(params);
        this.id(params.id || "st-nav-menu");
        if (params.userName && params.userName()) {
            this.userName(params.userName());
        }
        if (params.tabStrip != null) {
            this.tabStrip = params.tabStrip;
        }
        if (params.tabItems != null) {
            ko.utils.arrayPushAll(this.tabStrip().tabItems(), params.tabItems);
        }
    }
}
