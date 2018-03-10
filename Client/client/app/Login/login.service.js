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

    doLogin(details) {
        console.log('login details');
        console.log(details);
        return this.http.post('https://afternoon-cliffs-24932.herokuapp.com/login', details);
    }

    doSignUp(details) {
        return this.http.put('https://afternoon-cliffs-24932.herokuapp.com/signup', details);
    }


    getDetails(details) {
        console.log(details);
        const type = (details.isUser === true) ? 'user' : 'enterprise';
        return this.http.get(`https://afternoon-cliffs-24932.herokuapp.com/${type}/details/${details.username}`);
    }

    updateProfile(profileDetails, type) {
        return this.http.post(`https://afternoon-cliffs-24932.herokuapp.com/${type}/profile/update`, profileDetails);
    }
}


loginService.$inject = ['$http'];