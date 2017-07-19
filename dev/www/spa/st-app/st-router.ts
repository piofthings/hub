import * as ko from "knockout";
import { Route } from "./st-route";
import { MenuItem } from "../st-ui/view-models/st-nav-menu/st-menu-item";
import * as crossroads from "crossroads";

var Historyjs : Historyjs = <any> History;

class Router {
    currentRoute: KnockoutObservable<Route> = ko.observable<Route>();
    routes: KnockoutObservableArray<Route> = ko.observableArray<Route>([]);
    leftMenuItems: KnockoutObservableArray<MenuItem> = ko.observableArray<MenuItem>([]);
    rightMenuItems: KnockoutObservableArray<MenuItem> = ko.observableArray<MenuItem>([]);

    constructor() {
        $(document).on('click', 'a', this.handleAnchorClick);
        this.activateCrossroads();
    }

    public static newRouteFactory = (routePath: string, pageComponent: string, title?: string, roles? : Array<string>) => {
        let newRoute = new Route(routePath, title, pageComponent, roles);
        newRoute.title(title);
        return newRoute;
    }

    public registerRoute = (newRoute: Route) => {
        this.routes.push(newRoute);

        crossroads.addRoute(newRoute.path(), (crRoute) => {
            console.log(newRoute.path());
            let selectedRoute = ko.utils.arrayFirst<Route>(this.routes(), r=>r.path()==newRoute.path());
            selectedRoute.crRoute(crRoute);
            this.currentRoute(selectedRoute);

            $.get( "/api/accounts/login", ( data ) => {
                this.rightMenuItems.removeAll();
                if(data.user!=null)
                {
                    this.rightMenuItems.push(MenuItem.factory(data.user.username, '/profile', 'nav-menu-item', '', true, ['owner']));
                    selectedRoute.userName(data.user.username);
                    selectedRoute.userId(data.user._id);
                }
                else
                {
                    this.rightMenuItems.push(MenuItem.factory('Login', '/login', 'nav-menu-item', '', false, []));
                }
                if(selectedRoute!=null)
                {
                    selectedRoute.leftMenuItems = this.leftMenuItems;
                    selectedRoute.leftMenuItems().forEach((menuItem) => {
                        if(menuItem.needsAuthentication()==true){
                            menuItem.isVisible (data.user != null);
                        }else{
                            menuItem.isVisible(true);
                        }
                    });
                    selectedRoute.rightMenuItems = this.rightMenuItems;
                    selectedRoute.rightMenuItems().forEach((menuItem) => {
                        if(menuItem.needsAuthentication()==true){
                            menuItem.isVisible (data.user != null);
                        }
                        else {
                            menuItem.isVisible(true);
                        }
                    });
                    this.currentRoute(selectedRoute);
                    document.title = newRoute.title();
                }
            });
        });
    }

    public parseCurrentRoute = ()=>{
        this.historyStateChanged();
    }

    public parse = (route: string) => {
        crossroads.parse(route);
    }

    private handleAnchorClick = (event) => {
        try {
            let target = (event.target.tagName=='A')
                ? event.target
                : $(event.target).closest('a')[0];
            let url = $(target).attr("href");
            Historyjs.pushState(null, null, url);
        }
        catch(error) {
            //todo: log
            console.error(error);
        }
        return false;
    }

    private historyStateChanged = () => {
        let state = <any>Historyjs.getState();
        //console.log("historyStateChanged" + JSON.stringify(state));
        if(state.data && state.data.url != null)
        {
            return crossroads.parse(state.data.url);
        }
        else if (state.hash.length > 1) {
            var fullHash = state.hash;
            return crossroads.parse(fullHash);
        }
        else
        {
            return crossroads.parse('/');
        }
    }

    private getRoute = (url: string) => {
        var selectedRoute = ko.utils.arrayFirst<Route>(this.routes(), r=>r.path()==url);
        return selectedRoute;
    }

    private activateCrossroads = () => {
        Historyjs.Adapter.bind(window, "statechange", this.historyStateChanged);
        (<any>crossroads).normalizeFn = crossroads.NORM_AS_OBJECT;
    }

}

export { Router };
