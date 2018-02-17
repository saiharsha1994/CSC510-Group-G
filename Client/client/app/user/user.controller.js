'use strict';

export default class userCtrl {
    constructor($state) {
        this.state = $state;
    }

    $onInit() {
        console.log('User Ctrl is initialized');
    }

    logout() {
        // this.loginService.logout()  
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }
}

userCtrl.$inject = ['$state'];