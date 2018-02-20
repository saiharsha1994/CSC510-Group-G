'use strict';
const baseUrl = 'http://localhost:3000/enterprise/fetch/';
export default class userCtrl {
    constructor($sce, $stateParams, videoService) {
        this.$sce = $sce;
        this.$stateParams = $stateParams;
        this.videoService = videoService;
        this.config = {};
    }
    
    $onInit() {
        this.config.sources = _.map(this.videosList, (eachVideo) => {
            return {src: this.$sce.trustAsResourceUrl(`${baseUrl}${eachVideo.videoId}`), type: 'video/mp4'};
        });
        this.currentUrl = _.get(_.first(this.videosList), 'videoId');
        this.config.url = 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css';
        this.config.plugins = {
            poster: 'http://www.videogular.com/assets/images/videogular.png',
            controls: {
                autoHide: false,
                autoHideTime: 3000
            }
        };
        console.log('User Ctrl is initialized');
    }

    onPlayerReady(API) {
        console.log(API);
        this.api = API;
        console.log('ererwerwerwe');
        console.log(API);
    }

    onVideoComplete() {
        this.videoService.updateViewedList({username: this.$stateParams.id, videoId: this.currentUrl, time: this.api.totalTime}).then((response) => {
            console.log(response);
        }).catch((response) => {
            console.log(response);
        });
        console.log(this.api);
    }

    onUpdateTime(currentTime, duration) {
        console.log(currentTime);
        console.log(duration);
    }

    logout() {
        // this.loginService.logout()  
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }
}


userCtrl.$inject = ['$sce', '$stateParams', 'videoService'];