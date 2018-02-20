export default class videoService {

    constructor($http) {
        this.http = $http;
        console.log(this.http);
    }

    updateViewedList(obj) {
        return this.http.post('http://localhost:3000/user/videoUpdate', obj);
    }
}

videoService.$inject = ['$http'];
