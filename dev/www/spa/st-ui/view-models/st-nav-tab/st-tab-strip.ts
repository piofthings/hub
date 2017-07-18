import * as ko from "knockout";
import { TabItem } from "./st-tab-item";
export class TabStrip {
    tabItems: KnockoutObservableArray<TabItem> = ko.observableArray<TabItem>([]);
    selectedTabItem: KnockoutObservable<TabItem> = ko.observable<TabItem>();

    constructor() {
    }

    selectTabByName = (tabName: string) => {
        let oldSelectedTab = ko.utils.arrayFirst<TabItem>(this.tabItems(), t => t.active() == true);
        let selectedTab = ko.utils.arrayFirst<TabItem>(this.tabItems(), t => t.name().toLowerCase() == tabName.toLowerCase());
        if (oldSelectedTab != null && oldSelectedTab.name() != selectedTab.name()) {
            oldSelectedTab.active(false);
        }
        selectedTab.active(true);
        if (selectedTab != null) {
            this.selectedTabItem(selectedTab);
        }
    }
}
