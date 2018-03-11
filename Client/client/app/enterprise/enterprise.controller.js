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

        if (_.isEmpty(_.get(this.$stateParams, 'id'))) {
            this.state.go('home');
        }

        this.selectedFile = {};
        this.tags = [];
        this.multiSelect = false;
        this.videosList = _.get(this.$stateParams, 'eDetails.videos', []);
        this.coins = _.get(this.$stateParams, 'eDetails.coins', 0);
        this.coinsPerHour = _.get(this.$stateParams, 'eDetails.coinsPerHour', 0);

        this.updatedCoinsPerHour = 0;
        this.coinsToBeAdded = 0;
        this.currentVideo = {};
        this.enterpriseSearchTag = {};

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
        this.state.go('home');
    }

    addCoins() {
        if (this.coinsToBeAdded) {
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
        if (_.isEmpty(this.description) || _.isEmpty(this.title) || _.isEmpty(_.get(this.selectedFile, 'name'))) {
            this.dialogs.error('Error', 'Please enter all the details.');
            return;
        }
        this.showLoading = true;
        this.uploadService.upload({url: 'http://localhost:3000/enterprise/uploadVideo', data:{file: this.selectedFile}})
            .then((response) => {
                let videoDetails = {username: this.$stateParams.id, description: this.description,
                    title: this.title, fileId: _.get(response, 'data._id'),
                    tags: _.isNull(this.enterpriseSearchTag) ||
                    _.isEmpty(this.enterpriseSearchTag) ? [] : [this.enterpriseSearchTag]};
                if (_.isUndefined(videoDetails.fileId)) {
                    this.dialogs.error('Error', 'Error in uploading the file. Please try again.');
                    return this.$q.reject('File not uploaded properly');
                }
                return this.enterpriseService.uploadVideoDetails(videoDetails);
            }).then((response) => {
                this.description = '';
                this.title = '';
                this.searchTags = [];
                this.enterpriseSearchTag = {};
                this.videosList.push(response.data);
                this.selectedFile = '';
            }).catch(() => {
            this.dialogs.error('Error', 'Unable to upload video. Please try again.');
            }).finally(() => {
                this.showLoading = false;
            });
    }

    updatePassword() {
        if (this.updateProfile.confirmNewPassword === this.updateProfile.newPassword) {
            this.dialogs.error('Error', 'The passwords do not match');
            return;
        } else if (this.updateProfile.newPassword.length < 8) {
            this.dialogs.error('Error', 'The password should have at least 8 characters');
            return;
        }

        this.loginService.updateProfile(this.updateProfileDetails, 'enterprise').catch(() => {
            this.dialogs.error('Error', 'Failed to update the profile. Please try again');
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

    getStats() {
        this.enterpriseService.getStats(this.$stateParams.id).then((response) => {
            console.log(response.data);
        });
    }
}

enterpriseCtrl.$inject = ['$state', '$q', '$stateParams', 'Upload', 'enterpriseService', 'loginService', 'dialogs'];

  
