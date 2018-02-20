export default class videoService {

    constructor($http) {
        this.http = $http;
        console.log(this.http);
    }

    updateViewedList(obj) {
        return this.http.post('http://localhost:3000/user/viewed', obj);
    }

    getVideo(id) {
        return this.http.get(`http://localhost:3000/fetch/${id}`);
    }
}

videoService.$inject = ['$http'];
