import * as ko from "knockout";

export class ModalConfig {
    width: KnockoutObservable<string> = ko.observable<string>("70%");

    hasFooter: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    footerCss: KnockoutObservable<string> = ko.observable<string>("");

    headerText: KnockoutObservable<string> = ko.observable<string>("");
    headerTextCss: KnockoutObservable<string> = ko.observable<string>("");

    showClose: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    isVisible: KnockoutObservable<boolean> = ko.observable<boolean>(false);

    okayButtonText: KnockoutObservable<string> = ko.observable<string>("Ok");
    cancelButtonText: KnockoutObservable<string> = ko.observable<string>("Cancel");

    showFooter: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    okayButtonAction : (vm, event) => void;
    cancelButtonAction : (vm, event) => void;
}
