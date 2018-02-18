export default class loginService {
    constructor($http) {
        this.http = $http;
        console.log(this.http);
        this.message = 'there';
        this.signIn = {
            email: '',
            password: '',
            forgotPassword: false
        };
    }

    doLogin(details) {
        return this.http.post('http://localhost:3000/', details).then((response) => {
            console.log(response);
        }).catch((response) => {
            console.log('catch');
            console.log(response);
        });
    }

    doSignUp(details) {
        return this.http.put('http://localhost:3000/', details).then((response) => {
            console.log(response);
            // this.state.go
        }).catch((response) => {
            console.log('catch');
            console.log(response);
        });
    }
}


loginService.$inject = ['$http'];