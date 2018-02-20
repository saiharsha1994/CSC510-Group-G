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

    addComment(obj) {
        return this.http.post('http://localhost:3000/user/comments', obj);
    }

    getUserCoins(username) {
        return this.http.get(`http://localhost:3000/user/coins/${username}`, obj);
    }

    getViewedHistory(id) {
        return this/http/get(`http://localhost:3000/user/history/${id}`);
    }

    //TODO: update user profile user/profile/update
}

loginService.$inject = ['$http'];
