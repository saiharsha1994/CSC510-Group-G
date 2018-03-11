export default class enterpriseService {
    constructor($http) {
        this.http = $http;
    }

    addCoins(coins, username) {
        return this.http.post('https://afternoon-cliffs-24932.herokuapp.com/enterprise/addCoins', {coins: coins, username: username});
    }

    updateCoinsPerHour(coinsPerHour, username) {
        return this.http.post('https://afternoon-cliffs-24932.herokuapp.com/enterprise/updateCoinsPerHour',
            {coinsPerHour: coinsPerHour, username: username});
    }

    uploadVideoDetails(videoDetails) {
        return this.http.post('https://afternoon-cliffs-24932.herokuapp.com/enterprise/videoDetails', videoDetails);
    }

    deleteVideo(videoId) {
        return this.http.delete('https://afternoon-cliffs-24932.herokuapp.com/enterprise/deleteVideo/${videoId}`);
    }
}


enterpriseService.$inject = ['$http'];