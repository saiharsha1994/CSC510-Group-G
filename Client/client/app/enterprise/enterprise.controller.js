'use strict';

import enterpriseService from './enterprise.service';
import loginService from './../Login/login.service';

export default class enterpriseCtrl {
    constructor($state, $q, Upload, enterpriseService, loginService, $stateParams) {
        this.state = $state;
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.uploadService = Upload;
        this.enterpriseService = enterpriseService;
        this.loginService = loginService;
        this.selectedFile = {};
        this.updateType = 'password';
        this.updatedCoinsPerHour = 0;
        this.coinsToBeAdded = 0;
        this.tags = [];
        this.searchTag = '';
        this.videosList = _.get(this.$stateParams, 'eDetails.videos', []);
        this.coins = _.get(this.$stateParams, 'eDetails.coins', []);
        this.coinsPerHour = _.get(this.$stateParams, 'eDetails.coinsPerHour', []);
        this.currentVideo = {};
        this.updateProfile = {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          oldEmail: '',
          newEmail: '',
        };
    }

    addTag() {
        this.tags.push(this.searchTag);
        this.searchTag = '';
    }

    $onInit() {
        console.log('Enterprise initialized');
    }

    logout() {
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }

    addCoins() {
        this.enterpriseService.addCoins(this.coinsToBeAdded, this.$stateParams.id)
            .then((response) => {
                this.coinsToBeAdded = 0;
                this.coins = _.get(response, 'data.coins');
            }).catch((response) => {
                console.log(response);
            });
    }

    updateCoinsPerHour() {
        this.enterpriseService.updateCoinsPerHour(this.updatedCoinsPerHour, this.$stateParams.id)
            .then((response) => {
                this.updatedCoinsPerHour = 0;
                this.coinsPerHour = _.get(response, 'data.coinsPerHpur');
            }).catch((response) => {
            console.log(response);
        });
    }

    uploadVideo() {
        this.showLoading = true;
        this.uploadService.upload({url: 'http://localhost:3000/enterprise/uploadVideo', data:{file: this.selectedFile}})
            .then((response) => {
                let videoDetails = {username: this.$stateParams.id, description: this.description,
                    title: this.title, fileId: _.get(response, 'data._id'), tags: this.tags};
                if (_.isUndefined(videoDetails.fileId)) {
                    return this.$q.reject('File not uploaded properly');
                }
                return this.enterpriseService.uploadVideoDetails(videoDetails);
                //TODO: // /vidoeDetails  {username: '', description: '', title: '', fileId: response.data.id, tags: []}
                console.log(response);
            }).catch((response) => {
            console.log(response);
        }).finally((response) => {
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

enterpriseCtrl.$inject = ['$state', '$q', 'Upload', 'enterpriseService', 'loginService', '$stateParams'];

  
