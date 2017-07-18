import * as ko from "knockout";
import { MenuItem } from "../st-ui/view-models/st-nav-menu/st-menu-item";

class Route {
    path : KnockoutObservable<string> = ko.observable<string>();
    title : KnockoutObservable<string> = ko.observable<string>("");
    pageComponent: KnockoutObservable<string> = ko.observable<string>();
    roles : KnockoutObservableArray<string> = ko.observableArray<string>([]);
    userName: KnockoutObservable<string> = ko.observable<string>();
    userId: KnockoutObservable<string> = ko.observable<string>();
    crRoute: KnockoutObservable<any> = ko.observable<any>();
    leftMenuItems: KnockoutObservableArray<MenuItem> = ko.observableArray<MenuItem>([]);
    rightMenuItems: KnockoutObservableArray<MenuItem> = ko.observableArray<MenuItem>([]);
    constructor(newPath: string, newTitle: string, newPageComponent: string, newRoles?: Array<string>) {
        this.path(newPath);
        this.title(newTitle);
        this.pageComponent(newPageComponent);
        newRoles = newRoles || [];
        ko.utils.arrayPushAll<string>(this.roles, newRoles);
    }
}

export { Route } ;
