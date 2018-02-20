'use strict';

export default class userCtrl {
    constructor($state, $stateParams, loginService, userService) {
        this.state = $state;
        this.$stateParams = $stateParams;
        this.loginService = loginService;
        this.userService = userService;

        this.updateProfile = {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            userName: this.$stateParams.id
        };
    }

    $onInit() {
        this.videosList = this.$stateParams.uDetails;
        console.log(this.videosList);
        this.comments = _.get(_.filter(this.vidoesList, (video) => {
            return (video.id === this.currentUrl);
        }), 'comments', []);
        this.commentText = '';
    }

    claimCoins() {
        if (this.isVideoCompleted) {
            this.userService.claimCoins(this.$stateParams.id).then((response) => {
                this.isVideoCompleted = false;
            }).catch((response) => {
                // console.log(response);
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

    addComment() {
        this.userService.addComment({videoId: this.currentUrl, usernmae: this.$stateParams.id,
            comment: this.commentText}).then((response) => {
            console.log(response);
            this.commentText = '';
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

userCtrl.$inject = ['$state', '$stateParams', 'loginService', 'userService'];