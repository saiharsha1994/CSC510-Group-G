export default class enterpriseService {
    constructor($http) {
        this.http = $http;
    }

    addCoins(coins) {
        return this.http.post('http://localhost:3000/enterprise/addCoins', {coins: coins});
    }

    updateCoinsPerHour(coinsPerHour) {
        return this.http.post('http://localhost:3000/enterprise/addCoins', {coinsPerHour: coinsPerHour});
    }
}


enterpriseService.$inject = ['$http'];