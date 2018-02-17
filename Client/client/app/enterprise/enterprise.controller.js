'use strict';

export default class enterpriseCtrl {
    constructor($state) {
        this.state = $state;
    }

    $onInit() {
        console.log('Enterprise initialized');
    }

    logout() {
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }
}

enterpriseCtrl.$inject = ['$state'];