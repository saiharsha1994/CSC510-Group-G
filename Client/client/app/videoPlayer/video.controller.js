'use strict';

export default class userCtrl {
    constructor($sce) {
        this.$sce = $sce;
    }
    $onInit() {
        this.config = {
            sources: [
                {src: this.$sce.trustAsResourceUrl('http://static.videogular.com/assets/videos/videogular.mp4'), type: 'video/mp4'}
            ],
            tracks: [
                {
                    src: 'http://www.videogular.com/assets/subs/pale-blue-dot.vtt',
                    kind: 'subtitles',
                    srclang: 'en',
                    label: 'English',
                    default: ''
                }
            ],
            theme: {
                url: 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css'
            },
            plugins: {
                poster: 'http://www.videogular.com/assets/images/videogular.png',
                controls: {
                    autoHide: false,
                    autoHideTime: 3000
                }
            }
        };
        console.log('User Ctrl is initialized');
    }

    logout() {
        // this.loginService.logout()  
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }
}

userCtrl.$inject = ['$sce'];