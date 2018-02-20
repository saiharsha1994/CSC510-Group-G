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

    doLogin() {
        return this.http.post('/loginwhatever').then((response) => {
            console.log(response);
        }).catch((response) => {
            console.log('catch');
            console.log(response);
        });
    }
}

loginService.$inject = ['$http'];
