export default class sessionService {
    constructor($http) {
        this.http = $http;
        this.message = 'there';
        this.signIn = {
            email: '',
            password: '',
            forgotPassword: false
        };
    }

    deleteSession(id) {
        return this.http.delete(`http://lcalhost:3000/${id}/session/delete/${id}`);
    }

    isSessionValid(sessionId) {
        return this.http.get(`http://lcalhost:3000/${sessionId}/session/check/${sessionId}`);
    }

    createSession(id) {
        return this.http.put(`http://lcalhost:3000/${id}/session/create/`, {id: id});
    }
}


sessionService.$inject = ['$http'];