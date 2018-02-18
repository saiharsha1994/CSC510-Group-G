'use strict';

export default class enterpriseCtrl {
    constructor($state, Upload) {
        this.state = $state;
        this.uploadService = Upload;
        this.selectedFile = {};
    }

    $onInit() {
        console.log('Enterprise initialized');
    }

    logout() {
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }

    submit() {
        console.log(this.selectedFile);
        this.uploadService.upload({url: 'http://localhost:3000/uploadVideo', data:{file: this.selectedFile}})
            .then((response) => {
                console.log(response);
            }).catch((response) => {
                console.log(response);
            });
    }
}

enterpriseCtrl.$inject = ['$state', 'Upload'];