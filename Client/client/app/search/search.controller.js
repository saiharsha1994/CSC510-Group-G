'use strict';

export default class searchCtrl {
    constructor() {
        this.defaultTags = [
            {type: 'Laptops', isSelected: false},
            {type: 'Clothing', isSelected: false},
            {type: 'Mobiles', isSelected: false},
            {type: 'Cosmetics', isSelected: false},
            {type: 'Medicines', isSelected: false},
            {type: 'Restaurants', isSelected: false},
            {type: 'Grocery', isSelected: false},
            {type: 'Movies', isSelected: false},
            {type: 'Sports', isSelected: false},
            {type: 'Foot wear', isSelected: false}];
        this.enterpriseTag = _.first(this.defaultTags);
    }

    $onInit() {
        $('.dropdown-menu a').on( 'click', function(event) {
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