'use strict';

/* Controllers */

var nypApp = angular.module('nypApp', ['ngLoadingSpinner'])
    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     '*://www.bandcamp.com/**'
   ]);
    });

nypApp.controller('nypCtrl', function ($scope, $http, $sce) {

    $scope.alternative = true;
    $scope.rock = true;
    $scope.rap = true;
    $scope.electronic = true;
    $scope.pop = true;
    $scope.acoustic = true;
    $scope.folk = true;
    $scope.punk = true;
    $scope.experimental = true;
    $scope.soul = true;
    $scope.jazz = true;

    $scope.genre = 'bedroom-pop';
    $scope.sort = 'pop';
    $scope.page = 1;
    $scope.embedUrl;
    $scope.embedId;

    $http.post("/scrape", {
            genre: $scope.genre,
            sort: $scope.sort,
            page: $scope.page
        })
        .then(function (results) {
            //Success;
            console.log("Succss: " + results.status);
            $scope.items = results.data;
        }, function (results) {
            //error
            console.log("Error: " + results.status);
        });

    $scope.hideAll = function () {
        $scope.alternative = true;
        $scope.rock = true;
        $scope.rap = true;
        $scope.electronic = true;
        $scope.pop = true;
        $scope.acoustic = true;
        $scope.folk = true;
        $scope.punk = true;
        $scope.experimental = true;
        $scope.soul = true;
        $scope.jazz = true;
    }

    $scope.redownloadData = function () {
        $http.post("/scrape", {
                genre: $scope.genre,
                sort: $scope.sort,
                page: $scope.page
            })
            .then(function (results) {
                //Success;
                console.log("Succss: " + results.status);
                $scope.items = results.data;
            }, function (results) {
                //error
                console.log("Error: " + results.status);
            });
    }

    $scope.changeGenre = function (newGenre) {
        if (!($scope.genre == newGenre)) {
            $scope.genre = newGenre;
            $scope.page = 1;
            $scope.redownloadData();
        }
    }

    $scope.pgForward = function () {
        if ($scope.page < 10) {
           $scope.page++;  
        }
    }

    $scope.pgBackward = function () {
        if ($scope.page > 1) {
            $scope.page--;
        }
    }
    
    $scope.goToPage = function (newPage) {
        if (newPage >= 1 && newPage <= 10) {
            $scope.page = newPage;
        }
    }

    $scope.setEmbedUrl = function (id) {
        $scope.embedUrl = $sce.trustAsResourceUrl("https://bandcamp.com/EmbeddedPlayer/album=" + id + "/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/");
        $scope.embedUrlSmall = $sce.trustAsResourceUrl("https://bandcamp.com/EmbeddedPlayer/album=" + id + "/size=small/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/");
        $scope.embedId = id;
    }

});