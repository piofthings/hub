import "text!./st-feed-list.html";
import * as ko from "knockout";
import * as amplify from "amplify";
import { FeedListEvents } from "./st-feed-list-events";
import { HttpBase } from "../../../st-services/base/http-base";

export var template = require("text!./st-feed-list.html");
export class viewModel {
    recents: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    past: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    beginning: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    dataSource: KnockoutObservableArray<any>;
    subscriptions = [];
    saveInviteService : HttpBase;

    constructor(params) {
        console.log("List:" + params.feedItems());
        this.initServices();
        if (params.feedItems != null) {
            this.dataSource = params.feedItems;
            this.subscriptions.push(this.dataSource.subscribe((newValues) => {
                console.log("Data source changed: " + JSON.stringify(newValues, null, 1));
                this.recents.removeAll(); //TODO: Optimize
                ko.utils.arrayPushAll(this.recents, newValues);

            }));
            ko.utils.arrayPushAll(this.recents, params.feedItems());
        }
    }

    initServices = () => {
        this.saveInviteService = new HttpBase("PUT", "/api/inivite", this.inviteSaved, this.inviteNotSaved);

    }

    inviteSaved = (item: any) => {

    }

    inviteNotSaved = (item: any) => {
        
    }

    deleteClick = (item: any, event: Event) => {
        amplify.publish(FeedListEvents.DeleteFeedItem, item);
    }

    dispose() {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].dispose();
        }
    }
}
