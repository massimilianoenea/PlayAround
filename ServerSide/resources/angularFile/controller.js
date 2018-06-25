angular.module('PlayAround')

.controller('PlayAround',function ($scope, $sessionStorage,$http,socket) {
    delete $http.defaults.headers.common['X-Requested-With'];
    var player = document.getElementById('audio');
    var progressBar  = document.getElementById('progress-bar');

    /**
     *
     * Funzioni di avvio per check utente loggato e socket
     *
     */

    this.$onInit = function (){
        $http({
            method : "POST",
            url : '/playaround/getUtenteLog',
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        }).then(function mySuccess(response) {
            $scope.Utente = response.data;
            $sessionStorage.UserLogged = response.data;
            socket.emit('getFriend', {username: $sessionStorage.UserLogged.username, email: $sessionStorage.UserLogged.email});
            socket.emit('player_room', {username: $sessionStorage.UserLogged.username});
        }, function myError(response) {
            window.location.replace('/login');
        });
    };
/*
    $scope.$on('$viewContentLoaded', function(event) {
        socket.emit('getFriend', {username: $sessionStorage.UserLogged.username, email: $sessionStorage.UserLogged.email});
        socket.emit('player_room', {username: $sessionStorage.UserLogged.username});
    });
*/
    $sessionStorage.socket = socket;

    $scope.socketOn = function(){
        $sessionStorage.socket.isConnected();
    };

    /**
     *
     * Player response per la gestione dei dispositivi
     *
     */

    socket.on('player_room_response',function (data) {
        if(data.length >= 1){
            //var modal = document.getElementById('myModal');
            //modal.style.display = "block";
            for (var dispositivo in data){
                if(data[dispositivo].Current_client) {
                    console.log("il dispositivo corrente è: " + data[dispositivo].Current_client + "con ID: " + data[dispositivo].clientId);
                }else{
                    console.log("un dispositivo è: " + data[dispositivo].client + "con ID: " + data[dispositivo].clientId);
                }
            }
        }
    });


    /**
     *
     * Funzioni per enable e disable playerino
     *
     */

     $scope.disablePlayerino = function(){
       $sessionStorage.disable = false;
     };
     $scope.enablePlayerino = function () {
         $sessionStorage.disable=true;
     };
     $scope.getDisable=function () {
         if($sessionStorage.disable!==undefined) return $sessionStorage.disable;
         return true;
     };

    /**
     *
     * funzioni e socket per il player
     *
     */

    $scope.sendMessage = function(){
         $sessionStorage.socket.emit('event', {username: $sessionStorage.UserLogged.username, data:{username:'peppe' ,img:'/image/profile/utente.png',canzone:{titolo:"titolo Caznone",id:"id canzone"}}, date: new Date()});
     };

    $scope.loadBrano = function(codbrano){
        socket.emit('stream', {username:$sessionStorage.UserLogged.username});
    };

    ss(socket.getsocket()).on('audio-stream', function (stream, data) {
        var parts = [];
        stream.on('data', (chunk) => {
            parts.push(chunk);
        });
        stream.on('end', function () {
            audio.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
        });
    });

})













.controller('amiciOnCtrl', function ($scope, $sessionStorage) {
    var socket = $sessionStorage.socket;

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
        $scope.utente=User;
        $scope.isFriend = User.amici;

        var recently = [];
        $scope.addFriend = function () {
            $http({
                method : "POST",
                url : 'require/add_amico',
                data: {username:User.username},
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function mySuccess(response) {
                    $scope.isFriend = true;
                })
        };

        $scope.deleteFriend = function () {
            $http({
                method : "POST",
                url : 'require/delete_amico',
                data: {username:User.username},
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function mySuccess(response) {
                    $scope.isFriend = false;
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


    .controller('playlistCtrl', function($scope, PersonalPlaylist, $http){
        $scope.playlist=PersonalPlaylist;
        $scope.visible=false;
        $scope.create=true;

        $scope.showBox=function () {
            $scope.visible=$scope.visible=true;
        }
        $scope.hideBox=function () {
            $scope.visible=$scope.visible=false;
        }

       $scope.newPlaylist=function () {

           var parameter={nome_playlist:$scope.namePlaylist};
           $http({
               method:"POST",
               url : '/require/nuova_playlist',
               data: parameter,
               withCredentials: true,
               headers: { 'Content-Type': 'application/json' }
           }).then(function mySuccess(response){
               $scope.create=false;
           },function myError(response){
               $scope.message=true;
               $scope.error = response.data;
               console.log(response.data);
           });
       };
       $scope.addSong=function (selected) {
           var parameter = {codbrano:selected};
           $http({
               method:"POST",
               url : '/require/add_song',
               data: parameter,
               withCredentials: true,
               headers: { 'Content-Type': 'application/json' }
           })
           $scope.nomeBrano=selected.title;
       };
       $scope.salva=function(){
           $scope.visible=$scope.visible=false;
       };

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


    .controller('artistaCtrl', function ($scope, $http,Artista, AlbumArtista){
        $scope.artista=Artista;
        $scope.Album=AlbumArtista;

       window.onload = prepareButton();
        prepareButton = function () {

            if (Artista.followed) {
                document.getElementById("follow").innerText = "Unfollow";
                document.getElementById("follow").onclick = try_unFollow();
                document.getElementById("follow").style.color = "red";
            }
            else {
                document.getElementById("follow").innerText = "Follow";
                document.getElementById("follow").onclick = try_follow();
                document.getElementById("follow").style.color = "blue";
            }
        };
        $scope.try_follow = function () {
            var parameter = {codArtista:Artista.codice};
            $http({
                method: "POST",
                url: "require/follow_artista/" ,
                data: parameter,
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function mySuccess(response) {
                    document.getElementById("follow").innerHTML = "unfollow";
                    document.getElementById("follow").onclick = "try_unFollow()";
                    document.getElementById("follow").style.color = "red";
                })
        };
        $scope.try_unFollow = function () {
            var parameter = {codArtista:Artista.codice};
            $http({
                method: "POST",
                url: "require/delete_amico/+",
                data: parameter,
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }

            })
                .then(function mySuccess(response) {
                    document.getElementById("follow").innerHTML = "follow";
                    document.getElementById("follow").onclick = "try_follow()";
                    document.getElementById("follow").style.color = "blue";

                })
        };



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
