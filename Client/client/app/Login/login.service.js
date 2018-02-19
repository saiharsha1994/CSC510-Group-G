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
        return this.http.post('http://localhost:3000/', details);
    }

    doSignUp(details) {
        return this.http.put('http://localhost:3000/', details);
    }


    getDetails(details) {
        const type = (details.isUser === true) ? 'user' : 'enterprise';
        return this.http.get(`http://localhost:3000/${type}/details/${details.username}`);
    }
}


loginService.$inject = ['$http'];