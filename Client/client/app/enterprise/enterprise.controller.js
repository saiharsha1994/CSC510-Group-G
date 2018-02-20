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
            }).catch((response) => {
                console.log(response);
            });
    }

    updateCoinsPerHour() {
        this.enterpriseService.updateCoinsPerHour(this.updatedCoinsPerHour, this.$stateParams.id)
            .then((response) => {
                this.updatedCoinsPerHour = 0;
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
}

enterpriseCtrl.$inject = ['$state', '$q', 'Upload', 'enterpriseService', 'loginService', '$stateParams'];

$(document).ready(function () {
    // THE TOP (HEADER) LIST ITEM.
        $('#dynamic').on('click', 'a', function() {
            main = "SampleVideo_1280x720_10mb.mp4";
            
        });
        var jsonp = '[{ "video_number":"1" },{"video_number":"2" },{"video_number":"3" },{"video_number":"4" },{"video_number":"5" },{"video_number":"6" },{"video_number":"7" },{"video_number":"8" }]';
        var obj = $.parseJSON(jsonp);
        $.each(obj, function() {
            $('#dynamic').append('<li class="col-sm-12"><a class="thumbnail col-sm-4" id='+this['video_number']+'><img src="http://placehold.it/150x150&text='+this['video_number']+'"/></a><div class="tag"><a class="col-sm-8" id='+this['video_number']+'> CSS Layout - Horizontal & Vertical Align</a></div></li>');
        });
    $('#dynamic').listview('refresh');
    }); 
  
