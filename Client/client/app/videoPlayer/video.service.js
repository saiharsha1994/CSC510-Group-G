export default class videoService {

    constructor($http) {
        this.http = $http;
        console.log(this.http);
    }

    updateViewedList(obj) {
        return this.http.post('https://afternoon-cliffs-24932.herokuapp.com/user/viewed', obj);
    }

    getVideo(id) {
        return this.http.get(`https://afternoon-cliffs-24932.herokuapp.com/fetch/${id}`);
    }

    searchVideos(tags) {
        return this.http.post(`https://afternoon-cliffs-24932.herokuapp.com/user/search`, tags);
    }
}

videoService.$inject = ['$http'];
