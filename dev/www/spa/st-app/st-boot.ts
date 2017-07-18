import { app } from "./st-app";

requirejs.config(
{
    baseUrl: '/spa',
    paths:
    {
        "jQuery": "/libs/jquery/dist/jquery.min",
        "crossroads": "/libs/crossroads/dist/crossroads",
        "signals": "/libs/js-signals/dist/signals",
        "knockout": "/libs/knockout/dist/knockout",
        "text": "/libs/text/text",
        "historyjs": "/libs/history.js/scripts/bundled/html4+html5/native.history",
        "RSVP": "/libs/rsvp.js/rsvp.min",
        "amplify": "/libs/amplify/lib/amplify.min",
        "toastr":"/libs/toastr/toastr.min"
    },
    shim:
    {
        "jQery": { exports: "$" },
        "amplify": {
            exports: "amplify",
            deps : ["jQuery"]
        },
        "toastr": {
            exports: "toastr",
            deps: ["jQuery"]
        }
    }
});

requirejs(["jQuery", "knockout", "text", "historyjs", "RSVP", "st-app/st-app", "amplify"], ($, ko, text, history, RSVP, silkthread, amplify) => {
    var spa: app = new silkthread.app();
    spa.startUp();
    spa.registerComponent("profile-editor", "./ui/components/profile-editor/profile-editor");
    spa.registerComponent("invitations-list", "./ui/components/invitations-list/invitations-list");
    spa.registerComponent("invitation-editor", "./ui/components/invitation-editor/invitation-editor");
});
