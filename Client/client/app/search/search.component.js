import template from './search.html';
import controller from './search.controller.js'
import './search.component.scss';

const searchComponent = {
    scope: {
        multiSelect: '=?',
        searchTags: '=?',
        enterpriseTag: '=?'
    },
    template,
    controller,
    controllerAs: 'vm'
};

export default searchComponent;