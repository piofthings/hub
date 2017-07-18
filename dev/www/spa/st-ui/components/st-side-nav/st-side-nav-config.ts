import * as ko from "knockout";

export class SideNavConfig
{
    header: KnockoutObservable<string> = ko.observable<string>();
    constructor()
    {

    }

    public static factory(header: string)
    {
        var newConfig = new SideNavConfig();
        newConfig.header(header);
        return newConfig;
    }
}
