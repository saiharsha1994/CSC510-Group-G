import 'bootstrap-css-only';
import 'normalize.css';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import appComponent from './app.component';
import loginComponent from './Login/Login.component';
import userComponent from './user/user.component';
import enterpriseComponent from './enterprise/enterprise.component';
import loginService from './Login/login.service';
import ComponentsModule from './components/components';

angular.module('app', [ComponentsModule.name, 'ui.router'])
    .service('loginService', loginService)
    .component('app', appComponent)
    .component('loginComponent', loginComponent)
    .component('userComponent', userComponent)
    .component('enterpriseComponent', enterpriseComponent)
    .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
        console.log('gggggggggggggggggggg');
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
        })
}]);
