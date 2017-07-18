import * as toastr from "toastr";

export class Notifications {
    public static showSuccessToast(title: string, details: string, duration: number = 1000) {
        Notifications.setupToastrOptions(duration, true);
        toastr.success(details, title);
    }

    public static showErrorToast(title: string, details: string, duration: number = 1000, autoHide: boolean = false) {
        Notifications.setupToastrOptions(duration, autoHide);
        toastr.error(details, title);
    }

    public static showWarningToast(title: string, details: string, duration: number = 1000) {
        Notifications.setupToastrOptions(duration, true);
        toastr.error(details, title);
    }

    private static setupToastrOptions(duration: number, autoHide: boolean) {
        toastr.options.closeButton = true;
        toastr.options.debug = false;
        toastr.options.newestOnTop = false;
        toastr.options.progressBar = false;
        toastr.options.positionClass = "toast-top-right";
        toastr.options.preventDuplicates = false;
        toastr.options.onclick = null;
        toastr.options.showDuration = 300;
        if (autoHide) {
            toastr.options.hideDuration = duration;
            toastr.options.timeOut = 5000;
            toastr.options.extendedTimeOut = 1000;
        }
        else {
            toastr.options.hideDuration = 0;
            toastr.options.timeOut = 0;
            toastr.options.extendedTimeOut = 0;
        }
        toastr.options.showEasing = "swing";
        toastr.options.hideEasing = "linear";
        toastr.options.showMethod = "fadeIn";
        toastr.options.hideMethod = "fadeOut";
    }
}
