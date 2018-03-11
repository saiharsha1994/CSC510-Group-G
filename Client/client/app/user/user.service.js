export default class loginService {

    constructor($http) {
        this.http = $http;
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
        return this.http.post('https://afternoon-cliffs-24932.herokuapp.com/user/comments', obj);
    }

    getUserCoins(username) {
        return this.http.get(`http://localhost:3000/user/coins/${username}`);
    }

    redeemCoins(username) {
        return this.http.post('this.http.get(`http://localhost:3000/user/coins/${username}', {username:username});
    }

    getViewedHistory(id) {
        return this/http/get(`https://afternoon-cliffs-24932.herokuapp.com/user/history/${id}`);
    }
}

loginService.$inject = ['$http'];
