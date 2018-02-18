'use strict';

import SearchService from './search.service';

export default class SearchCtrl {
        constructor($state) {
            this.state = $state;
        }
    
        $onInit() {
            console.log('Search Ctrl is initialized');
        }
    
        logout() {
            // this.loginService.logout()  
            //TODO: delete the cookie or delete the session.
            this.state.go('home');
        }
    }
    
userCtrl.$inject = ['$state'];

