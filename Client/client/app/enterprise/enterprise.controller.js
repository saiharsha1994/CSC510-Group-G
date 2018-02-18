'use strict';

import enterpriseService from './enterprise.service';

export default class enterpriseCtrl {
    constructor($state, Upload, enterpriseService) {
        this.state = $state;
        this.uploadService = Upload;
        this.enterpriseService = enterpriseService;
        this.selectedFile = {};
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
}

enterpriseCtrl.$inject = ['$state', 'Upload', 'enterpriseService'];