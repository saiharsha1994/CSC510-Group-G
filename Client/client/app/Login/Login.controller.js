'use strict';

import loginService from './login.service';

export default class loginCtrl {
    constructor($state, $q, loginService, dialogs) {
        this.dialogs = dialogs;
        this.state = $state;
        this.$q = $q;
        this.loginService = loginService;
        this.isUser = true;
        this.signIn = {
            username: '',
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
        };
    }

    $onInit() {}

    canSubmit() {
        if (this.isSignIn) {
            if (_.isEmpty(this.signIn.username) || _.isEmpty(this.signIn.password)) {
                return 'Please enter the required information.';
            } else if (_.get(this.signIn, 'password', '').length < 8) {
                return 'The password should be of atleast 8 characters.';
            }
        } else {
            if (_.isUndefined(this.signUp.email)) {
                return 'Please enter a valid email address';
            } else if (_.isEmpty(this.signUp.username) || _.isEmpty(this.signUp.email) ||
                _.isEmpty(this.signUp.password) || _.isEmpty(this.signUp.confirmPassword)) {
                return 'Please enter the required information.';
            } else if (_.get(this.signUp, 'password') !== _.get(this.signUp, 'confirmPassword')) {
                return 'The passwords do not match.';
            } else if (_.get(this.signUp, 'password', '').length < 8) {
                return 'The password should be of at least 8 characters.';
            }
        }
        return '';
    }

    submit() {
        let errorMessage = this.canSubmit();
        if (_.isEmpty(errorMessage)) {
            if (this.isSignIn) {
                this.signIn.isUser = this.isUser;
                this.loginService.doLogin(this.signIn).then((response) => {
                    return this.loginService.getDetails(this.signIn);
                }).then((response) => {
                    if (this.signIn.isUser === true) {
                        this.state.go('user', {id: this.signIn.username, uDetails: response.data});
                    } else {
                        this.state.go('enterprise', {id: this.signIn.username, eDetails: response.data});
                    }
                }).catch((response) => {
                    if (response.status === 404) {
                        this.dialogs.error('Error', 'Please check the username you have entered');
                    } else if (response.status === 400) {
                        this.dialogs.error('Error', 'Please verify your password');
                    }
                });
            } else {
                if (this.signUp.password !== this.signUp.confirmPassword) {
                    this.errorMessage = 'Passwords do not match';
                    this.showError = true;
                    return;
                }
                this.signUp.isUser = this.isUser;
                this.loginService.doSignUp(this.signUp).then((response) => {
                    return this.loginService.getDetails(this.signUp);
                }).then((response) => {
                    if (this.signUp.isUser === true) {
                        this.state.go('user', {id: this.signUp.username, uDetails: response.data});
                    } else {
                        this.state.go('enterprise', {id: this.signUp.username, eDetails: response.data});
                    }
                }).catch((response) => {
                    if (response.status === 404) {
                        this.dialogs.error('Error', 'Please check the username you have entered');
                    } else if (response.status === 400) {
                        this.dialogs.error('Error', 'Please verify your password');
                    } else if (response.status === 409) {
                        this.dialogs.error('Error', 'An account already exists. Please enter new details');
                    }
                });
            }
        } else {
            this.dialogs.error('Error', errorMessage);
        }
    }
}

loginCtrl.$inject = ['$state', '$q', 'loginService', 'dialogs'];