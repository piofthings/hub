import * as ko from "knockout";

export class MenuItem {
    text: KnockoutObservable<string> = ko.observable<string>("");
    href: KnockoutObservable<string> = ko.observable<string>("");
    css: KnockoutObservable<string> = ko.observable<string>("");
    styles: KnockoutObservable<string> = ko.observable<string>("");
    isVisible: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    hrefCss: KnockoutObservable<string> = ko.observable<string>("");
    needsAuthentication: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    authorizedForRoles: KnockoutObservableArray<string> = ko.observableArray<string>([]);

    public static factory = (text: string, href: string, css: string, hrefCss: string, authenticated: boolean, roles: Array<string>): MenuItem => {
        let newMenuItem = new MenuItem();
        newMenuItem.text(text);
        newMenuItem.href(href);
        newMenuItem.css(css);
        newMenuItem.hrefCss(hrefCss);
        newMenuItem.needsAuthentication(authenticated);
        ko.utils.arrayPushAll<string>(newMenuItem.authorizedForRoles, roles);
        return newMenuItem;
    }
}
