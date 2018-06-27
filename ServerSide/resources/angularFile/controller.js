angular.module('PlayAround')

.controller('PlayAround',function ($scope, $sessionStorage,$http,socket) {
    delete $http.defaults.headers.common['X-Requested-With'];
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
            progressBar.addEventListener("click", seek);
            audio.addEventListener('timeupdate', updateProgressBar, false);
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
            modalDevice.style.display = "block";
            for (var dispositivo in data){
                if(data[dispositivo].Current_client) {
                    console.log("il dispositivo corrente è: " + deviceType(data[dispositivo].Current_client) + "\ncon ID: " + data[dispositivo].clientId);
                }else{
                    console.log("un dispositivo è: " + deviceType(data[dispositivo].Current_client) + "\ncon ID: " + data[dispositivo].clientId);
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
     * Funzione per il riconoscimento del dispositivo
     *
     */

    function deviceType(userAgent){
        if(userAgent.match(/Macintosh/i)) return "MacOS";
        if(userAgent.match(/Android/i)) return "Android";
        if(userAgent.match(/BlackBerry/i)) return "BlackBerry";
        if(userAgent.match(/iPhone/i)) return "iPhone";
        if(userAgent.match(/iPod/i)) return "iPod";
        if(userAgent.match(/iPad/i)) return "iPad";
        if(userAgent.match(/Windows Phone/i)) return "windows Phone";
        if(userAgent.match(/Ubuntu/i)) return "Linux";
    }

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
            playPause.className = 'fa fa-pause';
        });
    });

    function seek(e) {
        if (audio.src) {
            var percent = e.offsetX / this.offsetWidth;
            audio.currentTime = percent * audio.duration;
            e.target.value = Math.floor(percent / 100);
        }
    }

    function updateProgressBar() {
        // Work out how much of the media has played via the duration and currentTime parameters
       if(audio !== undefined) {
           var percentage = Math.floor((100 / audio.duration) * audio.currentTime);
           //LOCAL VERSION
           // Update the progress bar's value
           //progressBar.value = percentage;
           // Update the progress bar's text (for browsers that don't support the progress element)
           //progressBar.innerHTML = progressBar.title = percentage + '% played';
           socket.emit('PercentageBar', {
               username: $sessionStorage.UserLogged.username,
               progress: percentage,
               currentTime: audio.currentTime
           });
       }
    }

    function formatTime(seconds) {
        minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    socket.on('updateProgressBar',function(data){
        progressBar.value = data.progress;
        musicTime.innerText = formatTime(data.currentTime);
    });

    $scope.playPause = function(){
       if(playPause.getAttribute('class') ==='fa fa-play' && audio.paused){
           socket.emit('play', {username:$sessionStorage.UserLogged.username});
           playPause.className = 'fa fa-pause';
           if(!this.getDisable()) playerPlayPause.className = 'fa fa-pause';
       }else{
           socket.emit('pause', {username:$sessionStorage.UserLogged.username});
           playPause.className = 'fa fa-play';
           if(!this.getDisable()) playerPlayPause.className = 'fa fa-play';
       }
    };

    $scope.isPaused = function(){
      return audio.paused;
    };

    socket.on('play_music',function(data){
        audio.play();
    });
    socket.on('pause_music',function(data){
        audio.pause();
    });
    socket.on('play_button',function(data){
        playPause.className = 'fa fa-play';
    });
    socket.on('pause_button',function(data){
        playPause.className = 'fa fa-pause';
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
        var nomePlaylist = "";
        $scope.playlist=PersonalPlaylist;
        $scope.visible=false;
        $scope.create=true;

        $scope.showBox=function () {
            $scope.visible=true;
        };
        $scope.hideBox=function () {
            $scope.visible=false;
        };

       $scope.newPlaylist=function () {

           var parameter={nome_playlist:$scope.namePlaylist};
           $http({
               method:"POST",
               url : '/require/nuova_playlist',
               data: parameter,
               withCredentials: true,
               headers: { 'Content-Type': 'application/json' }
           }).then(function mySuccess(response){
               nomePlaylist = $scope.namePlaylist;
               $scope.create=false;
           },function myError(response){
               $scope.message=true;
               $scope.error = response.data;
               console.log(response);
           });
       };
       $scope.addSong=function (selected) {
           var parameter = {codbrano:selected.originalObject.codice,nome_playlist:nomePlaylist};
           $http({
               method:"POST",
               url : '/require/add_song',
               data: parameter,
               withCredentials: true,
               headers: { 'Content-Type': 'application/json' }
           });
           $scope.nomeBrano=selected.title;
       };
       $scope.salva=function(){
           $scope.visible=$scope.visible=false;
       };

        })
    .controller('playlistUtCtrl', function ($scope, Playlist, $http) {
        $scope.playlistUt=Playlist;
        $scope.delete=function () {
            var parameter = {};
            $http({
                method: "POST",
                url: "/require/delete_playlist",
                data: parameter,
                withCredentials: true,
                headers: {'Content-Type': 'application/json'}
            })
        };
        $scope.add=function () {
            var parameter = {codbrano:$scope.codice};
            $http({
                method: "POST",
                url: "/require/add_song",
                data: parameter,
                withCredentials: true,
                headers: {'Content-Type': 'application/json'}
            })
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
        $scope.album=AlbumArtista;
        $scope.isFollowed=Artista.followed;

        $scope.addArtista = function () {
            $http({
                method : "POST",
                url : 'require/follow_artista',
                data: {username:Artista.nome},
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function mySuccess(response) {
                    $scope.isFollowed = true;
                })
        };

        $scope.deleteArtista = function () {
            $http({
                method : "POST",
                url : 'require/unfollow_artista',
                data: {username:Artista.nome},
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(function mySuccess(response) {
                    $scope.isFollowed = false;
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
    .controller('albumCtrl', function($scope,Album, BraniAlbum){
        $scope.album=Album;
        $scope.brani=BraniAlbum;
        //$scope.altri=AltriAlbum;

    });
