export default class enterpriseService {
    constructor($http) {
        this.http = $http;
    }

    addCoins(coins, username) {
        return this.http.post('http://localhost:3000/enterprise/addCoins', {coins: coins, username: username});
    }

    updateCoinsPerHour(coinsPerHour, username) {
        return this.http.post('http://localhost:3000/enterprise/updateCoinsPerHour',
            {coinsPerHour: coinsPerHour, username: username});
    }

    uploadVideoDetails(videoDetails) {
        return this.http.post('http://localhost:3000/enterprise/videoDetails', videoDetails);
    }

    getReport(id) {
        return this.http.get(`http://localhost:3000/enterprise/stats/${id}`);
    }

    deleteVideo(videoId) {
        return this.http.delete(`http://localhost:3000/enterprise/deleteVideo/${videoId}`);
    }
}


enterpriseService.$inject = ['$http'];