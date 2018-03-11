	
	'use strict';

    export default class searchCtrl {
        constructor() {
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
            var options = [];
            $( '.dropdown-menu a' ).on( 'click', function( event ) {
                var $target = $( event.currentTarget ),
                    val = $target.attr( 'data-value' ),
                    $inp = $target.find( 'input' ),
                    idx;

                if ( ( idx = options.indexOf( val ) ) > -1 ) {
                    options.splice( idx, 1 );
                    setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
                } else {
                    options.push( val );
                    setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
                }

                $( event.target ).blur();

                console.log( options );
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