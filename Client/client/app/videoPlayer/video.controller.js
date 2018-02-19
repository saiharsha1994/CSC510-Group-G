'use strict';
var main = "SampleVideo_1280x720_10mb.mp4";
export default class userCtrl {
    constructor($sce) {
        this.$sce = $sce;
    }
    
    $onInit() {
        this.config = {
            sources: [
                {src: this.$sce.trustAsResourceUrl('http://localhost:3000/enterprise/fetch/'+main), type: 'video/mp4'}
            ],
            tracks: [
                {
                    src: 'http://www.videogular.com/assets/subs/pale-blue-dot.vtt',
                    kind: 'subtitles',
                    srclang: 'en',
                    label: 'English',
                    default: ''
                }
            ],
            theme: {
                url: 'https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css'
            },
            plugins: {
                poster: 'http://www.videogular.com/assets/images/videogular.png',
                controls: {
                    autoHide: false,
                    autoHideTime: 3000
                }
            }
        };
        console.log('User Ctrl is initialized');
    }
    logout() {
        // this.loginService.logout()  
        //TODO: delete the cookie or delete the session.
        this.state.go('home');
    }
}


userCtrl.$inject = ['$sce'];
// from here
jQuery(document).ready(function($) {
 
    $('#myCarousel').carousel({
            interval: 5000
    });

    //Handles the carousel thumbnails
    $('[id^=carousel-selector-]').click(function () {
    var id_selector = $(this).attr("id");
    try {
        var id = /-(\d+)$/.exec(id_selector)[1];
        console.log(id_selector, id);
        jQuery('#myCarousel').carousel(parseInt(id));
    } catch (e) {
        console.log('Regex failed!', e);
    }
});
    // When the carousel slides, auto update the text
    $('#myCarousel').on('slid.bs.carousel', function (e) {
             var id = $('.item.active').data('slide-number');
            $('#carousel-text').html($('#slide-content-'+id).html());
    });
});

$(document).ready(function () {
// THE TOP (HEADER) LIST ITEM.
    $('#dynamic').on('click', 'a', function() {
        main = "SampleVideo_1280x720_10mb.mp4";
        
    });
    var jsonp = '[{ "video_number":"1" },{"video_number":"2" },{"video_number":"3" },{"video_number":"4" },{"video_number":"5" },{"video_number":"6" },{"video_number":"7" },{"video_number":"8" }]';
    var obj = $.parseJSON(jsonp);
    $.each(obj, function() {
        $('#dynamic').append('<li class="col-sm-12"><a class="thumbnail col-sm-4" id='+this['video_number']+'><img src="http://placehold.it/150x150&text='+this['video_number']+'"/></a><div class="tag"><a class="col-sm-8" id='+this['video_number']+'> CSS Layout - Horizontal & Vertical Align</a></div></li>');
    });
$('#dynamic').listview('refresh');
}); 