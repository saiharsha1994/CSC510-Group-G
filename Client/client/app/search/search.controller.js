	
	'use strict';

    export default class searchCtrl {
        constructor() {
            this.isUser = true;
            this.defaultTags = [
                {type: 'Laptops', id: 'tags1', sSelected: false},
                {type: 'Clothing',id: 'tags2', isSelected: false},
                {type: 'Mobiles',id: 'tags3', isSelected: false},
                {type: 'Cosmetics',id: 'tags4', isSelected: false},
                {type: 'Medicines',id: 'tags5', isSelected: false},
                {type: 'Restaurants',id: 'tags6', isSelected: false},
                {type: 'Grocery',id: 'tags7', isSelected: false},
                {type: 'Movies',id: 'tags8', isSelected: false},
                {type: 'Sports',id: 'tags9', isSelected: false},
                {type: 'Foot wear',id: 'tags10', isSelected: false}];
            this.enterpriseTag = _.first(this.defaultTags);
        }
    
        
        $onInit() {

        }
    
        canSelectMore() {
            return this.multiSelect || _.filter(this.defaultTags, (tag) => {return tag.isSelected;}).length === 0;
        }
    
        onSave() {
            this.searchTags = _.filter(this.defaultTags, (tag) => {return tag.isSelected;});
        }
    }
    
    searchCtrl.$inject = ['$scope'];