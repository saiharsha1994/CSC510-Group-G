'use strict';

export default class userCtrl {
    constructor($state, $stateParams, loginService, userService, dialogs, sessionService) {
        this.state = $state;
        this.$stateParams = $stateParams;
        this.loginService = loginService;
        this.userService = userService;
        this.sessionService = sessionService;
        this.dialogs = dialogs;

        this.multiSelect = true;
        this.searchTags = [];

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
        var options = [];
    }

    claimCoins() {
        if (this.isVideoCompleted) {
            this.userService.claimCoins(this.$stateParams.id).then((response) => {
                this.isVideoCompleted = false;
            }).catch((response) => {
                this.dialogs.error('Error', 'Unable to add this video to your viewed video list.');
            });
        }
    }

    updateProfile() {
        this.loginService.updateProfile(this.updateProfile).then((response) => {
            console.log(response);
        }).catch((response) => {
            this.dialogs.error('Error', 'Unable to update profile now. Please try again');
        });
    }

    addComment() {
        this.userService.addComment({videoId: this.currentUrl, usernmae: this.$stateParams.id,
            comment: this.commentText}).then((response) => {
            console.log(response);
            this.commentText = '';
        }).catch((response) => {
            this.dialogs.error('Error', 'Unable to add comments now. Please try again');
        });
    }

    redeemCoins() {
        this.userService.redeemCoins(this.$stateParams.id).then((response)=> {
            this.userCoins = _.get(response, 'data.coins', 0);
        }).catch(() => {
            this.dialogs.error('Error', 'Unable to redeem coins now. Please try again');
        });
    }

    logout() {
        this.sessionService.deleteSession(this.$stateParams.id).then(() => {
            this.state.go('home');
        }).catch(() => {
            //have to do logout
        }).finally(() => {
            this.state.go('home');
        });
    }
}

userCtrl.$inject = ['$state', '$stateParams', 'loginService', 'userService', 'dialogs', 'sessionService'];