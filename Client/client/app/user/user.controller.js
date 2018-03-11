'use strict';

export default class userCtrl {
    constructor($state, $stateParams, loginService, userService, dialogs, sessionService, videoService) {
        this.state = $state;
        this.$stateParams = $stateParams;
        this.loginService = loginService;
        this.userService = userService;
        this.sessionService = sessionService;
        this.dialogs = dialogs;
        this.videoService = videoService;
        this.searchTags = [];
        this.shouldShowCoins = false;
        this.coins = 0;
        this.isUser = true;

        if (_.isEmpty(_.get(this.$stateParams, 'id'))) {
            this.state.go('home');
        }

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

    showCoins() {
        console.log('enter showCoins');
        this.userService.getUserCoins(this.$stateParams.id)
            .then((response) => {
                this.coins = _.get(response, 'data.coins');
                this.shouldShowCoins = true;
            }).catch(() => {
                this.dialogs.error('Error', 'Unable to fetch users coins. Please try again.');
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

    searchVideos() {
        console.log(this.searchTags);
        let tags = _.filter(this.searchTags, (tag) => {return tag.isSelected === true;});
        let tagNames = _.map(tags, (tag) => {return tag.type; });
        console.log(tags);
        this.videoService.searchVideos(tagNames).then((response) => {
            this.videosList = _.get(response, 'data', []);
        }).catch(() => {
            this.dialogs.error('Error', 'Unable to search videos');
        });
    }

    $postLink() {
        console.log('postlink of user');
    }
}

userCtrl.$inject = ['$state', '$stateParams', 'loginService', 'userService', 'dialogs', 'sessionService', 'videoService'];