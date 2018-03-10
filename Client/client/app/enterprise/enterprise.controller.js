'use strict';

import enterpriseService from './enterprise.service';
import loginService from './../Login/login.service';

export default class enterpriseCtrl {
    constructor($state, $q, $stateParams, Upload, enterpriseService, loginService, dialogs) {
        this.state = $state;
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.uploadService = Upload;
        this.enterpriseService = enterpriseService;
        this.loginService = loginService;
        this.dialogs = dialogs;

        this.selectedFile = {};
        this.tags = [];
        this.multiSelect = false;
        this.videosList = _.get(this.$stateParams, 'eDetails.videos', []);
        this.coins = _.get(this.$stateParams, 'eDetails.coins', 0);
        this.coinsPerHour = _.get(this.$stateParams, 'eDetails.coinsPerHour', 0);

        this.updatedCoinsPerHour = 0;
        this.coinsToBeAdded = 0;
        this.currentVideo = {};

        this.updateProfile = {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          oldEmail: '',
          newEmail: '',
        };
    }

    $onInit() {
        this.currentVideo = _.first(this.videosList);
    }

    logout() {
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }

    addCoins() {
        console.log(this.coinsPerHour);
        if (this.coinsPerHour) {
            this.enterpriseService.addCoins(this.coinsToBeAdded, this.$stateParams.id)
                .then((response) => {
                    this.coinsToBeAdded = 0;
                    console.log(response.data);
                    this.coins = _.get(response, 'data.coins');
                }).catch(() => {
                this.dialogs.error('Error', 'Can not add coins. Please try again.');
            });
        }
    }

    updateCoinsPerHour() {
        if (this.updatedCoinsPerHour) {
            this.enterpriseService.updateCoinsPerHour(this.updatedCoinsPerHour, this.$stateParams.id)
                .then((response) => {
                    this.updatedCoinsPerHour = 0;
                    console.log(response.data);
                    this.coinsPerHour = _.get(response, 'data.coinsPerHour');
                }).catch((response) => {
                this.dialogs.error('Error', 'Can not update coinsPerHour. Please try again.');
            });
        }
    }

    uploadVideo() {
        this.showLoading = true;
        this.uploadService.upload({url: 'http://localhost:3000/enterprise/uploadVideo', data:{file: this.selectedFile}})
            .then((response) => {
                let videoDetails = {username: this.$stateParams.id, description: this.description,
                    title: this.title, fileId: _.get(response, 'data._id'),
                    tags: _.map(this.searchTags, (tag) => {return tag.type})};
                if (_.isUndefined(videoDetails.fileId)) {
                    return this.$q.reject('File not uploaded properly');
                }
                return this.enterpriseService.uploadVideoDetails(videoDetails);
            }).then(() => {
                this.description = '';
                this.title = '';
                this.searchTags = [];
            }).catch(() => {
            this.dialogs.error('Error', 'Unable to upload video. Please try again.');
            }).finally(() => {
                this.showLoading = false;
            });
    }

    updateProfile() {
        this.loginService.updateProfile(this.updateProfileDetails, 'enterprise').then((response) => {
            console.log(response + 'success');
        }).catch((response) => {
            console.log(response + 'failed');
        });
    }

    onVideoChange(video) {
        this.currentVideo = video;
    }

    deleteSelectedVideo() {
        this.enterpriseService.deleteVideo(this.currentVideo.videoId).then((response) => {
            _.remove(this.videosList, (video) => {
                return video.videoId === this.currentVideo.videoId;
            });
        }).catch((response) => {
            console.log('the video is not deleted');
        });
    }
}

enterpriseCtrl.$inject = ['$state', '$q', '$stateParams', 'Upload', 'enterpriseService', 'loginService', 'dialogs'];

  
