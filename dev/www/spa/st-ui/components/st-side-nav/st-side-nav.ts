import "text!./st-side-nav.html";
import * as ko from "knockout";
import { TabStrip } from "../../view-models/st-nav-tab/st-tab-strip";
import { TabItem } from "../../view-models/st-nav-tab/st-tab-item";
export var template = require("text!./st-side-nav.html");

export class viewModel
{
    private tabStrip : KnockoutObservableArray<TabStrip>;
    private header: KnockoutObservable<string> = ko.observable<string>("My Account");
    constructor(params)
    {
        if(params.tabStrip != null)
        {
            this.tabStrip = params.tabStrip;
        }
        if(params.sideNavConfig != null)
        {
            let menuConfig = null;
            if(ko.isObservable(params.sideNavConfig))
            {
                menuConfig = params.sideNavConfig();
            }
            else
            {
                menuConfig = params.sideNavConfig;
            }
            if(ko.isObservable(menuConfig.header))
            {
                this.header = menuConfig.header;
            }
            else
            {
                this.header(menuConfig.header);
            }
        }

    }
}
