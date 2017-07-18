import * as ko from "knockout";

export class BaseComponent
{
    id: KnockoutObservable<string> = ko.observable<string>("");
    constructor(params)
    {
    }
}
