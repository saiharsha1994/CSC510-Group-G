import template from './search.html';
import controller from './search.controller.js'
import './search.component.scss';

const searchComponent = {
    bindings: {
        searchTags: '=?',
        enterpriseSearchTag: '=?',
        isUser: '=',
        searchVideos: '&?'
    },
    template,
    controller,
    controllerAs: 'vm'
};

export default searchComponent;