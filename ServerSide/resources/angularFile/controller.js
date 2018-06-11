angular.module('PlayAround')
.controller('amiciOnCtrl', function ($scope, listaOn) {

    $scope.users = listaOn.users;

    /*$scope.currentUser = null;

    $scope.showUser = function (id) {
        if (id) {
            userService.loadSingle(id).success(function (data) {
                $scope.currentUser = data;
            });
        } else {
            $scope.currentUser = null;
        }

    };*/

    listaOn.load();


})
    .controller('utenteCtrl', function($scope,$http,User){
        $scope.User=User;
        })


    .controller('playlistCtrl', function($scope){

})

.controller('amiciCtrl', function ($scope, listaAmici) {

    $scope.users = listaAmici.users;
    listaAmici.load();
})
