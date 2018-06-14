angular.module('PlayAround')

.controller('PlayAround',function ($scope, $sessionStorage) {
    $scope.checkOn = function(){
        console.log("check on send");
        if(isConnected()===true){
            //AGGIORNA LA LISTA DEGLI UTENTI AMICI LATO SERVER, SI METTE IN ASCOLTO DEGLI AMICI
            update_friend({username:'peppe'});
            //send_message({username:response.data.username,text:response.data.username+" ha effettuato l'accesso"});
        }else{
            console.log("not connected");
        }
    };

    $scope.sendMess = function(){
        var json = {username:'peppe' ,img:'/image/profile/utente.png',canzone:{titolo:"titolo Caznone",id:"id canzone"}};
        if(isConnected()===true){
            //Manda un messaggio
            send_message({username:'peppe',text:json});
            //send_message({username:response.data.username,text:response.data.username+" ha effettuato l'accesso"});
        }else {
            console.log("not connected");
        }
    };
     $scope.disablePlayerino = function(){
       $sessionStorage.disable = false;
     };
     $scope.enablePlayerino= function () {
         $sessionStorage.disable=true;
     };
     $scope.getDisable=function () {
         if($sessionStorage.disable!==undefined) return $sessionStorage.disable;
         return true;
     };

})
.controller('amiciOnCtrl', function ($scope, socket, $sessionStorage) {
 socket.on('message',function (data) {
     /*
     if(!$scope.users){
         $scope.users = [];
     $scope.users.push(data);
     }else{
         var i,user;
         for(i=0; i<$scope.users.length; i++) {
             user = $scope.users[i];
             if (user.username === data.username) {
                 $scope.users.splice(i, 1);
             }
         }
        $scope.users.push(data);
     }
     */
     if(!$sessionStorage.users){
         $sessionStorage.users = [];
         $sessionStorage.users.push(data);
     }else{
         var i,user;
         for(i=0; i<$sessionStorage.users.length; i++) {
             user = $sessionStorage.users[i];
             if (user.username === data.username) {
                 $sessionStorage.users.splice(i, 1);
             }
         }
         $sessionStorage.users.push(data);
     }
 });

    socket.on('connect',function(data){
        console.log("connected with angularJs");
        socket.emit('getFriend', {username: 'peppe', email: 'email'});
    });

    $scope.getUsers= function(){
        if($sessionStorage.users !== undefined) return $sessionStorage.users;
        return [];
    }
})
    .controller('utenteCtrl', function($scope,$http,User){
        $scope.User=User;
        })


    .controller('playlistCtrl', function($scope){

})
    .controller('tueCanzoniCtrl', function ($scope){

    })
    .controller('recentiCtrl', function ($scope){

    })

.controller('amiciCtrl', function ($scope, listaAmici) {

    $scope.users = listaAmici.users;
    listaAmici.load();
})

.controller('playerCtrl', function ($scope) {

})
    .controller('artistaCtrl', function ($scope){

    })
    .controller('moodCtrl', function ($scope) {

    })
    .controller('artistiPrefCtrl', function ($scope){

    })
    .controller('sceltiCtrl', function ($scope) {

    })
    .controller('piuAscoltatiCtrl', function ($scope) {

    })
    .controller('homeCtrl', function ($scope){

    })
;
