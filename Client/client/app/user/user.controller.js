'use strict';

export default class userCtrl {
    constructor($state, $stateParams) {
        this.state = $state;
        this.$stateParams = $stateParams;
        console.log('enter user from state change');
    }

    $onInit() {
        console.log('User Ctrl is initialized');
        console.log(this.$stateParams);
    }

    logout() {
        // this.loginService.logout()  
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }
}

userCtrl.$inject = ['$state', '$stateParams'];