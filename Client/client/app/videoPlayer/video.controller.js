'use strict';
const baseUrl = 'http://localhost:3000/user/fetch/';
export default class userCtrl {
    constructor($sce, $stateParams, videoService) {
        this.$sce = $sce;
        this.$stateParams = $stateParams;
        this.videoService = videoService;
        this.config = {};
    }
    
    $onInit() {
        console.log(' video component (this.videosList');
        console.log(this.videosList);
        this.videoIds = _.map(this.videosList, 'videoId');
        let currentVideo = _.first(this.videosList);
        this.config.sources = [{src: `${baseUrl}${_.get(currentVideo, 'fileId')}`, type: 'video/mp4'}];
        this.comments = _.get(currentVideo, 'comments', []);
        this.comments.push({username: 'modda', body: 'rty'});
        this.comments.push({username: 'modda', body: 'rty'});
        this.comments.push({username: 'modda', body: 'rty'});
        this.comments.push({username: 'modda', body: 'rty'});
        console.log('this.config');
        console.log(this.config);
            this.config.theme = 'node_modules/videogular-themes-default/videogular.css';
            this.config.plugins = {
                poster: 'http://www.videogular.com/assets/images/videogular.png'
            };
    }

    onPlayerReady(API) {
        console.log(API);
        this.api = API;
        console.log('ererwerwerwe');
        console.log(API);
    }

    onVideoChange(video) {
        console.log('onVideoChange');
        console.log(video);
        this.api.pause();
        this.config.sources = [];
        this.config.sources = [{src: `${baseUrl}${_.get(video, 'fileId')}`, type: 'video/mp4'}];
        this.api.currentTime = 0;
        this.comments = _.get(_.first(_.filter(this.videosList, (eachVideo) => {
            return eachVideo.videoId === video.videoId;
        })), 'comments', []);
    }

    onVideoComplete() {
        this.videoService.updateViewedList({username: this.$stateParams.id,
            videoId: this.currentUrl, time: this.api.totalTime}).then((response) => {
            console.log(response);
        }).catch((response) => {
            console.log(response);
        });
        console.log(this.api);
    }

    logout() {
        // this.loginService.logout()  
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }
}


userCtrl.$inject = ['$sce', '$stateParams', 'videoService'];