'use strict';

export default class appCtrl {
    constructor(dialogs) {
        this.dialogs = dialogs;
        console.log(this.dialogs);
    }

    $onInit() {
        console.log('App is initializedpopoppopo');
    }
}

appCtrl.$inject = ['dialogs'];
