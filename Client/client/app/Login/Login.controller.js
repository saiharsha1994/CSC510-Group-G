'use strict';

import loginService from './login.service';

export default class loginCtrl {
    constructor($state, $q, loginService) {
        this.state = $state;
        this.$q = $q;
        this.loginService = loginService;
        this.signIn = {
            email: '',
            password: '',
            isUser: true
        };

        this.isSignIn = true;

        this.signUp = {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            isUser: false
        }
    }

    $onInit() {
        console.log('Login is initialized');
    }

    submit() {
        if (this.isSignIn) {
            this.loginService.doLogin(this.signIn).then((response) => {
                if (this.signIn.isUser === true) {
                    this.state.go('user', {id: this.signIn.email});
                } else {
                    this.state.go('enterprise', {id: this.signIn.email});
                }
            }).catch((response) => {
                if (response.status === 404) {
                    this.errorMessage = 'Please check the username you have entered';
                } else if (response.status === 400) {
                    this.errorMessage = 'Please verify your password';
                }
                this.showError = true;
            });
        } else {
            this.loginService.doSignUp(this.signUp).then(() => {
                if (this.signIn.isUser === true) {
                    this.state.go('user', {id: this.signIn.username});
                } else {
                    this.state.go('enterprise', {id: this.signIn.username});
                }
            }).catch((response) => {
                if (response.status === 409) {
                    this.errorMessage = response.body;
                } else if (response.status === 400) {
                    this.errorMessage = 'Bad request';
                }
                this.showError = true;
            });
        }
    }
}

loginCtrl.$inject = ['$state', '$q', 'loginService'];