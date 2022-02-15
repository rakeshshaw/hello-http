import { ErrorHandler } from "@angular/core";


export class AppErrorHandlers extends ErrorHandler {
    handleError(error) {
        alert('umexpected Error');
        console.log(error);
    }
}