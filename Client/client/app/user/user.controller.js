'use strict';

export default class userCtrl {
    constructor($state, $stateParams, loginService) {
        this.state = $state;
        this.$stateParams = $stateParams;
        this.loginService = loginService;
        this.vidoesList = this.$stateParams.uDetails;
        console.log('enter user from state change');

        this.updateProfile = {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            userName: this.$stateParams.id
        };
    }

    $onInit() {
        console.log('User Ctrl is initialized');
        console.log(this.$stateParams);
    }

    claimCoins() {
        if (this.isVideoCompleted) {
            this.userService.claimCoins(this.$stateParams.id).then((response) => {
                this.isVideoCompleted = false;
            }).catch((response) => {
                console.log(response);
            });
        }
    }

    updateProfile() {
        this.loginService.updateProfile(this.updateProfile).then((response) => {
            console.log(response);
        }).catch((response) => {
            console.log(response);
        });
    }

    logout() {
        // this.loginService.logout()  
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }
}

userCtrl.$inject = ['$state', '$stateParams', 'loginService'];