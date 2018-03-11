'use strict';

import enterpriseService from './enterprise.service';
import loginService from './../Login/login.service';

export default class enterpriseCtrl {
    constructor($state, $scope, $q, $stateParams, Upload, enterpriseService, loginService, dialogs) {
        this.state = $state;
        this.$q = $q;
        this.scope = $scope;
        this.$stateParams = $stateParams;
        this.uploadService = Upload;
        this.enterpriseService = enterpriseService;
        this.loginService = loginService;
        this.dialogs = dialogs;
        this.statCount = -1;

        if (_.isEmpty(_.get(this.$stateParams, 'id'))) {
            this.state.go('home');
        }

        this.selectedFile = {};
        this.tags = [];
        this.multiSelect = false;
        this.videosList = _.get(this.$stateParams, 'eDetails.videos', []);
        this.coins = _.get(this.$stateParams, 'eDetails.coins', 0);
        this.coinsPerHour = _.get(this.$stateParams, 'eDetails.coinsPerHour', 0);

        this.updatedCoinsPerHour = 0;
        this.coinsToBeAdded = 0;
        this.currentVideo = {};
        this.enterpriseSearchTag = {};

        this.updateProfile = {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          oldEmail: '',
          newEmail: '',
        };
    }

    $onInit() {
        this.currentVideo = _.first(this.videosList);
    }

    logout() {
        this.state.go('home');
    }

    addCoins() {
        if (this.coinsToBeAdded) {
            this.enterpriseService.addCoins(this.coinsToBeAdded, this.$stateParams.id)
                .then((response) => {
                    this.coinsToBeAdded = 0;
                    console.log(response.data);
                    this.coins = _.get(response, 'data.coins');
                }).catch(() => {
                this.dialogs.error('Error', 'Can not add coins. Please try again.');
            });
        }
    }

    updateCoinsPerHour() {
        if (this.updatedCoinsPerHour) {
            this.enterpriseService.updateCoinsPerHour(this.updatedCoinsPerHour, this.$stateParams.id)
                .then((response) => {
                    this.updatedCoinsPerHour = 0;
                    console.log(response.data);
                    this.coinsPerHour = _.get(response, 'data.coinsPerHour');
                }).catch((response) => {
                this.dialogs.error('Error', 'Can not update coinsPerHour. Please try again.');
            });
        }
    }

    uploadVideo() {
        if (_.isEmpty(this.description) || _.isEmpty(this.title) || _.isEmpty(_.get(this.selectedFile, 'name'))) {
            this.dialogs.error('Error', 'Please enter all the details.');
            return;
        }
        this.showLoading = true;
        this.uploadService.upload({url: 'http://localhost:3000/enterprise/uploadVideo', data:{file: this.selectedFile}})
            .then((response) => {
                let videoDetails = {username: this.$stateParams.id, description: this.description,
                    title: this.title, fileId: _.get(response, 'data._id'),
                    tags: _.isNull(this.enterpriseSearchTag) ||
                    _.isEmpty(this.enterpriseSearchTag) ? [] : [this.enterpriseSearchTag]};
                if (_.isUndefined(videoDetails.fileId)) {
                    this.dialogs.error('Error', 'Error in uploading the file. Please try again.');
                    return this.$q.reject('File not uploaded properly');
                }
                return this.enterpriseService.uploadVideoDetails(videoDetails);
            }).then((response) => {
                this.description = '';
                this.title = '';
                this.searchTags = [];
                this.enterpriseSearchTag = {};
                this.videosList.push(response.data);
                this.selectedFile = '';
            }).catch(() => {
            this.dialogs.error('Error', 'Unable to upload video. Please try again.');
            }).finally(() => {
                this.showLoading = false;
            });
    }

    updatePassword() {
        if (this.updateProfile.confirmNewPassword === this.updateProfile.newPassword) {
            this.dialogs.error('Error', 'The passwords do not match');
            return;
        } else if (this.updateProfile.newPassword.length < 8) {
            this.dialogs.error('Error', 'The password should have at least 8 characters');
            return;
        }

        this.loginService.updateProfile(this.updateProfileDetails, 'enterprise').catch(() => {
            this.dialogs.error('Error', 'Failed to update the profile. Please try again');
        });
    }

    onVideoChange(video) {
        this.currentVideo = video;
    }

    deleteSelectedVideo() {
        this.enterpriseService.deleteVideo(this.currentVideo.videoId).then((response) => {
            _.remove(this.videosList, (video) => {
                return video.videoId === this.currentVideo.videoId;
            });
        }).catch((response) => {
            console.log('the video is not deleted');
        });
    }

    showStats() {
        if (this.statCount === 1) {
            this.data = [];
            d3.select("#stats").update();
        }

        this.enterpriseService.getStats(this.$stateParams.id).then((response) => {
            var w = 400,                        //width
                h = 400,                            //height
                r = 200,                            //radius
                color = d3.scale.category20c();
            this.data = response.data;
            this.type= 'showStats';
            this.statCount = 1;
            var vis = d3.select("#stats")
                .append("svg:svg")              //create the SVG element inside the <body>
                .data([this.data])                   //associate our data with the document
                .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", h)
                .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
            var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
                .innerRadius(r-90)
                .outerRadius(r)
            var pie = d3.layout.pie()           //this will create arc data for us given a list of values
                .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array
            var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
                .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)
            arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
            arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")                          //center the text on it's origin
                .text((d, i) => { return this.data[i].label; });        //get the label from our original data array
        });
    }

    $onDestroy() {
        d3.select("#stats").remove();
    }

    $postLink() {
        this.scope.$watch('vm.type', (newValue) => {
            // if (this.statCount === 1) {
            //     this.statCount = 0;
            //     d3.select("#stats").remove();
            // }
        });
    }
}

enterpriseCtrl.$inject = ['$state','$scope',  '$q', '$stateParams', 'Upload', 'enterpriseService', 'loginService', 'dialogs'];