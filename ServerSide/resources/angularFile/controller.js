angular.module('PlayAround')

.controller('PlayAround',function ($scope, $sessionStorage,$http) {
    delete $http.defaults.headers.common['X-Requested-With'];

    this.$onInit = function (){
        $http({
            method : "POST",
            url : '/playaround/getUtenteLog',
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        }).then(function mySuccess(response) {
            $scope.Utente = response.data;
        }, function myError(response) {
            window.location.replace('/login');
        });
    };
/*
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
    */
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

    $scope.$on('$viewContentLoaded', function(event) {
        if(socket.isConnected()===true){
            socket.emit('getFriend', {username: $scope.Utente.username, email: $scope.Utente.email});
            socket.emit('player_room', {username: $scope.Utente.username});
            //send_message({username:response.data.username,text:response.data.username+" ha effettuato l'accesso"});
        }else{
            console.log("not connected");
            return true;
        }
    });

 socket.on('message',function (data) {

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
    });

    $scope.getUsers= function(){
        if($sessionStorage.users !== undefined) return $sessionStorage.users;
        return [];
    }
})
    .controller('utenteCtrl', function($scope,$http,User) {
        var recently = [];
        window.onload = prepareButton();
        prepareButton = function () {

            if (User.amici) {
                document.getElementById("follow").innerText = "Unfollow";
                document.getElementById("follow").onclick = try_unFollow();
                document.getElementById("follow").style.color = "red";
            }
            else {
                document.getElementById("follow").innerText = "Follow";
                document.getElementById("follow").onclick = try_Follow();
                document.getElementById("follow").style.color = "blue";
            }
        };

        $scope.try_follow = function () {
            $http({
                method: "GET",
                url: "require/add_amico/" + User.username
            })
                .then(function mySuccess(response) {
                    document.getElementById("follow").innerHTML = "unfollow";
                    document.getElementById("follow").onclick = "try_unFollow()";
                    document.getElementById("follow").style.color = "red";
                })
        };

        $scope.try_unFollow = function () {
            $http({
                method: "GET",
                url: "require/delete_amico/+" + User.username
            })
                .then(function mySuccess(response) {
                    document.getElementById("follow").innerHTML = "follow";
                    document.getElementById("follow").onclick = "try_follow()";
                    document.getElementById("follow").style.color = "blue";

                })
        };

        $http({
            method: "GET",
            url: "require/ascoltati_recente_utente/" + User.username
        })
            .then(function mySuccess(response) {
                recently.push.apply(response);
            });


    })


    .controller('playlistCtrl', function($scope, PersonalPlaylist){
        $scope.playlist=PersonalPlaylist;
    })
    .controller('tueCanzoniCtrl', function ($scope, Saved){
        $scope.salvate=Saved;
    })
    .controller('recentiCtrl', function ($scope, Recenti){
        $scope.recenti=Recenti;
    })

    .controller('amiciCtrl', function ($scope, Amici) {
        $scope.amici=Amici;
    })


    .controller('artistaCtrl', function ($scope, $http,Artista, SongArtista){
        window.onload = prepareButton();
        prepareButton = function () {

            if (Artista.amici) {
                document.getElementById("follow").innerText = "Unfollow";
                document.getElementById("follow").onclick = try_unFollow();
                document.getElementById("follow").style.color = "red";
            }
            else {
                document.getElementById("follow").innerText = "Follow";
                document.getElementById("follow").onclick = try_Follow();
                document.getElementById("follow").style.color = "blue";
            }
        }
        $scope.try_follow = function () {
            $http({
                method: "POST",
                url: "require/add_amico/" + Artista.username
            })
                .then(function mySuccess(response) {
                    document.getElementById("follow").innerHTML = "unfollow";
                    document.getElementById("follow").onclick = "try_unFollow()";
                    document.getElementById("follow").style.color = "red";
                })
        }
        $scope.try_unFollow = function () {
            $http({
                method: "GET",
                url: "require/delete_amico/+" + Artista.username
            })
                .then(function mySuccess(response) {
                    document.getElementById("follow").innerHTML = "follow";
                    document.getElementById("follow").onclick = "try_follow()";
                    document.getElementById("follow").style.color = "blue";

                })
        }
        $scope.artista=Artista;
        $scope.brani=SongArtista;

    })
    .controller('moodCtrl', function ($scope, Mood) {
      $scope.mood=Mood;
    })
    .controller('artistiPrefCtrl', function ($scope, ArtistiPreferiti){
      $scope.preferiti=ArtistiPreferiti;
    })
    .controller('sceltiCtrl', function ($scope) {

    })
    .controller('piuAscoltatiCtrl', function ($scope) {


    })
    .controller('homeCtrl', function ($scope, Giornaliera, Recently, AmiciSong) {
       $scope.playlistG=Giornaliera;
       $scope.recently=Recently;
       $scope.musicFriends=AmiciSong;
    })
    .controller('playerCtrl', function($scope){

    })
    .controller('albumCtrl', function($scope,Album, BraniAlbum,){
        $scope.album=Album;
        $scope.brani=BraniAlbum;
    });
