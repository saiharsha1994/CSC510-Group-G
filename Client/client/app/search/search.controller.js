	
	'use strict';

    export default class searchCtrl {
        constructor() {
            this.defaultTags = [
                {type: 'Laptops', id: 1, sSelected: false},
                {type: 'Clothing',id: 2, isSelected: false},
                {type: 'Mobiles',id: 3, isSelected: false},
                {type: 'Cosmetics',id: 4, isSelected: false},
                {type: 'Medicines',id: 5, isSelected: false},
                {type: 'Restaurants',id: 6, isSelected: false},
                {type: 'Grocery',id: 7, isSelected: false},
                {type: 'Movies',id: 8, isSelected: false},
                {type: 'Sports',id: 9, isSelected: false},
                {type: 'Foot wear',id: 10, isSelected: false}];
            this.enterpriseTag = _.first(this.defaultTags);
        }
    
        
        $onInit() {
            var options = [];
            $(document).on('click', ".small", function() {
                var $target = $( event.currentTarget ),
                    val = $(this).attr('data-value'),
                    $inp = $target.find( 'input' ),
                    idx;
                   // alert($(this).attr('data-value'));
                if ( ( idx = options.indexOf( val ) ) > -1 ) {
                    options.splice( idx, 1 );
                    setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
                } else {
                    options.push( val );
    
                    setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
                }
    
                $( event.target ).blur();
                return false;
            });
        }
    
        canSelectMore() {
            return this.multiSelect || _.filter(this.defaultTags, (tag) => {return tag.isSelected;}).length === 0;
        }
    
        onSave() {
            this.searchTags = _.filter(this.defaultTags, (tag) => {return tag.isSelected;});
        }
    }
    
    searchCtrl.$inject = ['$scope'];