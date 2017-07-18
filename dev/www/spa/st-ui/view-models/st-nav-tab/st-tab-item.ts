import * as ko from "knockout";

export class TabItem{
    name: KnockoutObservable<string> = ko.observable<string>("");
    text: KnockoutObservable<string> = ko.observable<string>("");
    href: KnockoutObservable<string> = ko.observable<string>("");
    css: KnockoutObservable<string> = ko.observable<string>("tab-nav");
    isSpa: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    styles: KnockoutObservable<string> = ko.observable<string>("");
    isVisible: KnockoutObservable<boolean>;
    active: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    hrefCss: KnockoutObservable<string> = ko.observable<string>("");
    componentName: KnockoutObservable<string> = ko.observable<string>("");
    needsAuthentication: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    authorizedForRoles: KnockoutObservableArray<string> = ko.observableArray<string>([]);

    public static factory = (text: string, name: string, href?: string, css?: string, hrefCss: string = "", componentName: string = "") : TabItem =>{
        let newTabItem = new TabItem();
        newTabItem.text(text);
        newTabItem.href(href);
        newTabItem.css(css);
        newTabItem.hrefCss(hrefCss);
        newTabItem.name(name);
        newTabItem.componentName(componentName);
        return newTabItem;
    }
}
