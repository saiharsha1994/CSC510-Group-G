'use strict';
const baseUrl = 'https://afternoon-cliffs-24932.herokuapp.com/user/fetch/';
export default class userCtrl {
    constructor($sce, $stateParams, videoService, userService) {
        this.$sce = $sce;
        this.$stateParams = $stateParams;
        this.videoService = videoService;
        this.userService = userService;
        this.config = {};
        this.currentVideoId = '';
        this.newComment = '';
    }
    
    $onInit() {
        this.videoIds = _.map(this.videosList, 'videoId');
        let currentVideo = (!_.isEmpty(this.videosList)) ? _.first(this.videosList) : {};
        this.currentVideoId = _.get(currentVideo, 'videoId', '');
        this.config.sources = [{src: `${baseUrl}${_.get(currentVideo, 'fileId')}`, type: 'video/mp4'}];
        this.comments = _.get(currentVideo, 'comments', []);
            this.config.theme = 'node_modules/videogular-themes-default/videogular.css';
            this.config.plugins = {
                poster: 'http://www.videogular.com/assets/images/videogular.png'
            };
    }

    onPlayerReady(API) {
        this.api = API;
    }

    onCommentType(event) {
        if (_.get(event, 'keyCode') === 13) {
            this.userService.addComment({username: this.$stateParams.id, videoId: this.currentVideoId,
                comment: this.newComment}).then((response) => {
                    this.comments.push({username: this.$stateParams.id, body: this.newComment});
                    this.newComment = '';
            });
        }
    }

    onVideoChange(video) {
        console.log(video);
        this.api.pause();
        this.config.sources = [];
        this.config.sources = [{src: `${baseUrl}${_.get(video, 'fileId')}`, type: 'video/mp4'}];
        this.api.currentTime = 0;
        this.currentVideoId = _.get(video, 'videoId');
        this.comments = _.get(_.first(_.filter(this.videosList, (eachVideo) => {
            return eachVideo.videoId === video.videoId;
        })), 'comments', []);
    }

    onVideoComplete() {
        console.log(this.currentVideoId);
        this.videoService.updateViewedList({username: this.$stateParams.id,
            videoId: this.currentVideoId, time: this.api.totalTime}).then((response) => {
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


userCtrl.$inject = ['$sce', '$stateParams', 'videoService', 'userService'];