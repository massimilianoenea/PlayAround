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

.controller('PlayAround', function($scope, $http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    $scope.checkOn = function(){
        $http({
            method : "POST",
            url : '/playaround/getUtenteLog',
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        }).then(function mySuccess(response) {
            $scope.Utente = response.data;
            if(isConnected()===true){
                update_friend(response.data);
                set_dispositivo(response.data);
                //send_message({username:response.data.username,text:response.data.username+" ha effettuato l'accesso"});
            }else{
                console.log("not connected");
            }
        }, function myError(response) {
            window.location.href = '/login';
        });
    };
});

