'use strict';

import loginService from './login.service';

export default class loginCtrl {
    constructor($state, loginService) {
        this.state = $state;
        this.loginSerivce = loginService;
        this.signIn = {
            email: '',
            password: '',
            forgotPassword: false,
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
            this.loginSerivce.doLogin(this.signIn).then((response) => {
                if (this.signIn.isUser === true) {
                    this.state.go('user', response.body);
                } else {
                    this.state.go('enterprise', response.body);
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
            this.loginSerivce.doSignUp(this.signUp).then(() => {
                if (this.signIn.isUser === true) {
                    this.state.go('user');
                } else {
                    this.state.go('enterprise');
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

loginCtrl.$inject = ['$state', 'loginService'];