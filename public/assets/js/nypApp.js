'use strict';

/* Controllers */

var nypApp = angular.module('nypApp', ['ngLoadingSpinner']);

nypApp.controller('nypCtrl', function ($scope, $http) {
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
    
    $scope.changeGenre = function(newGenre) {
        if (!($scope.genre == newGenre)) {
            $scope.genre = newGenre;
            $scope.redownloadData();
        }
    }
    
    $scope.pgForward = function() {
        $scope.page++;
    }
    
    $scope.pgBackward = function(){
        if ($scope.page > 1) {
            $scope.pg--;
        }
    }
});