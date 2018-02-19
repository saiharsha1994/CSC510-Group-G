'use strict';

import enterpriseService from './enterprise.service';
import loginService from './../Login/login.service';

export default class enterpriseCtrl {
    constructor($state, Upload, enterpriseService, loginService) {
        this.state = $state;
        this.uploadService = Upload;
        this.enterpriseService = enterpriseService;
        this.loginService = loginService;
        this.selectedFile = {};
        this.updateType = 'password';
        this.updateProfile = {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          oldEmail: '',
          newEmail: '',
        };
    }

    $onInit() {
        console.log('Enterprise initialized');
    }

    logout() {
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }

    addCoins() {
        this.enterpriseService.addCoins(this.coinsToBeAdded)
            .then((response) => {
                console.log(response);
            }).catch((response) => {
                console.log(response);
            });
    }

    updateCoinsPerHour() {
        this.enterpriseService.updateCoinsPerHour(this.updatedCoinsPerHour)
            .then((response) => {
                console.log(response);
            }).catch((response) => {
            console.log(response);
        });
    }

    uploadVideo() {
        this.uploadService.upload({url: 'http://localhost:3000/uploadVideo', data:{file: this.selectedFile}})
            .then((response) => {
                console.log(response);
            }).catch((response) => {
            console.log(response);
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

enterpriseCtrl.$inject = ['$state', 'Upload', 'enterpriseService', 'loginService'];