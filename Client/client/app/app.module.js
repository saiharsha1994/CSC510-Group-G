import 'bootstrap-css-only';
import 'normalize.css';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
// import videogular from 'videogular';
import {videogular} from 'videogular/dist/videogular/videogular';
import {videogularControl} from 'videogular-controls/vg-controls';
import {videogularOverlayPlay} from 'videogular-overlay-play/vg-overlay-play';
import {videogularPoster} from 'videogular-poster/vg-poster';
import ngSanitize from 'angular-sanitize';
import angularFileUpload from 'ng-file-upload/dist/ng-file-upload';
import appComponent from './app.component';
import loginComponent from './Login/Login.component';
import userComponent from './user/user.component';
import videoComponent from './videoPlayer/video.component';
import enterpriseComponent from './enterprise/enterprise.component';
import loginService from './Login/login.service';
import ComponentsModule from './components/components';

angular.module('app', [ComponentsModule.name, 'ui.router', 'ngSanitize', 'ngFileUpload', 'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'])
    .service('loginService', loginService)
    .component('app', appComponent)
    .component('loginComponent', loginComponent)
    .component('userComponent', userComponent)
    .component('enterpriseComponent', enterpriseComponent)
    .component('videoComponent', videoComponent)
    .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
        console.log('how');
        $urlRouterProvider.otherwise('/');
        $stateProvider
        .state('home', {
            url: '/',
            template: '<app></app>'
        })
        .state( 'user', {
            url: '/user/',
            template: '<user-component></user-component>'
        }).state( 'enterprise', {
            url: '/enterprise/',
            template: '<enterprise-component></enterprise-component>'
        });
}]);
