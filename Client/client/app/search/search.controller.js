'use strict';

export default class searchCtrl {
    constructor() {}
    $onInit() {
        console.log(this.searchTags);
        this.searchTags = [
            {type: 'Laptops', id: 'tags1', sSelected: false},
            {type: 'Clothing', id: 'tags2', isSelected: false},
            {type: 'Mobiles', id: 'tags3', isSelected: false},
            {type: 'Cosmetics', id: 'tags4', isSelected: false},
            {type: 'Medicines', id: 'tags5', isSelected: false},
            {type: 'Restaurants', id: 'tags6', isSelected: false},
            {type: 'Grocery', id: 'tags7', isSelected: false},
            {type: 'Movies', id: 'tags8', isSelected: false},
            {type: 'Sports', id: 'tags9', isSelected: false},
            {type: 'Foot wear', id: 'tags10', isSelected: false}];
        this.enterpriseSearchTag = _.first(this.searchTags);
        this.isOpen = false;
        $(document).on('click', '.dropdown-menu', function (e) {
            if ($(this).hasClass('keep-open-on-click')) {
                e.stopPropagation();
            }
        });
    }
}

searchCtrl.$inject = [];