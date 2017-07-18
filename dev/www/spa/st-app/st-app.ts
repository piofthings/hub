import * as ko from "knockout";
import * as toastr from "toastr";
import { Router } from "./st-router";
import { Route } from "./st-route";
import { MenuItem } from "../st-ui/view-models/st-nav-menu/st-menu-item";

export class app {
    router: Router;

    constructor() {
        this.router = new Router();
    }

    public startUp = () => {
        this.registerMenuItems();
        this.registerComponents();
        this.registerRoutes();
    }

    private registerMenuItems = () => {
        //console.log("Registering menu items.");
        this.router.leftMenuItems.push(MenuItem.factory('&#xf015;', '/', 'nav-header nav-menu-item', 'fa', false, []));
        this.router.leftMenuItems.push(MenuItem.factory('Blog', '/blog', 'nav-menu-item', '', false, []));
        this.router.leftMenuItems.push(MenuItem.factory('Reflection', '/feed', 'nav-menu-item', '', true, ['owner']));
    }

    private registerComponents = () => {
        this.registerComponent("home", "./ui/pages/home/home");
        this.registerComponent("blog", "./ui/pages/blog/blog");
        this.registerComponent("login", "./ui/pages/login/login");
        this.registerComponent("profile", "./ui/pages/profile/profile");
        this.registerComponent("verify", "./ui/pages/verify/verify");
        this.registerComponent("register", "./ui/pages/register/register");
        this.registerComponent("reflections", "./ui/pages/reflections/reflections");
        this.registerComponent("invitation", "./ui/pages/invitation/invitation");

        this.registerComponent("print-preview", "./ui/print-preview/print-preview");
        this.registerComponent("st-nav-menu", "./st-ui/components/st-nav-menu/st-nav-menu");
        this.registerComponent("st-nav-tab", "./st-ui/components/st-nav-tab/st-nav-tab");
        this.registerComponent("st-side-nav", "./st-ui/components/st-side-nav/st-side-nav");
        this.registerComponent("st-image-uploader", "./st-ui/components/st-image-uploader/st-image-uploader");
        this.registerComponent("st-feed-list", "./st-ui/components/st-feed-list/st-feed-list");
        this.registerComponent("st-modal", "./st-ui/components/st-modal/st-modal");
    }

    private registerRoutes = () => {
        this.registerRoute(Router.newRouteFactory("/blog/:routeParams*:", "blog",  "Blog | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/login/:routeParams*:", "login",  "Login | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/profile/:tab:/:routeParams*:", "profile",  "Profile | :tab: | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/profile/:routeParams*:", "profile",  "Profile | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/verify/:verificationCode:/:routeParams*:", "verify",  "Verify Account | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/register/:routeParams*:", "register",  "Register | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/feed/:routeParams*:", "reflections",  "My Reflections"));
        this.registerRoute(Router.newRouteFactory("/invitation/:invitationid:", "invitation",  "Invitation | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/:routeParams*:", "home",  "Home | The lazy blogger!"));

        this.router.parseCurrentRoute();
        ko.applyBindings(this.router.currentRoute);
    }

    public registerRoute = (newRoute: Route) => {
        this.router.registerRoute(newRoute);
    }

    public registerComponent = (name: string, location: string) => {
        ko.components.register(name, { require: location });
    }
}
