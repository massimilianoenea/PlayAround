angular.module('PlayAround')

.controller('PlayAround',function ($scope, $sessionStorage,$http,socket,$compile) {
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
            progressBar.addEventListener("click", seek);
            audio.addEventListener('timeupdate', updateProgressBar, false);
            audio.addEventListener('ended',audioEnd);
            $scope.getRepeatStyle();
            socket.emit('event', {username: $sessionStorage.UserLogged.username, data:{username:$sessionStorage.UserLogged.username ,img:'/image/profile/' + $sessionStorage.UserLogged.username +'.png',canzone:{titolo:"titolo Caznone",id:"id canzone"}}});
        }, function myError(response) {
            window.location.replace('/login');
        });
    };

    /**
     *
     * Funzione per formattare il return della search
     *
     */

    $scope.searchResponseFormatter=function(response){
        var data = [];
        if(response.length>0){
            angular.forEach(response,function(value,key){
                angular.forEach(value,function(subValue,subKey){
                    angular.forEach(subValue,function(val,chiave){
                        switch (subKey) {
                            case "brani":
                                data.push({val:{type:"Brano: ",response:{nome:val.titolo + " "+ val.anno,codice:val.codice,immagine:val.immagine},original:val}});
                                break;
                            case "artisti":
                                data.push({val:{type:"Artista: ",response:{nome:val.nome,codice:val.codice,immagine:val.immagine},original:val}});
                                break;
                            case "album":
                                data.push({val:{type:"Album: ",response:{nome:val.titolo + " "+ val.anno,codice:val.codice,immagine:val.immagine},original:val}});
                                break;
                            case "utenti":
                                data.push({val:{type:"Utente: ",response:{nome:val.username,codice:val.username,immagine:"/image/profile/"+val.username+".png"},original:val}});
                                break;
                            default:
                                data.length = 0;
                        }
                    });
                });
            });
            return data;
        }else{
            return data;
        }
    };
/*
    $scope.$on('$viewContentLoaded', function(event) {
        socket.emit('getFriend', {username: $sessionStorage.UserLogged.username, email: $sessionStorage.UserLogged.email});
        socket.emit('player_room', {username: $sessionStorage.UserLogged.username});
    });
*/

    /**
     *
     * gestione della socket
     * @type {socket|*}
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

    socket.on('getFriendDone',function(data){
        socket.emit('player_room', {username: $sessionStorage.UserLogged.username});
        $sessionStorage.isGetFriend = 1;
    });

    socket.on('player_room_response',function (data) {

        if(data.length >= 1 && ($sessionStorage.deviceSetted === undefined || $sessionStorage.deviceSetted !== true)){
            modalDevice.style.display = "block";
            for (var dispositivo in data){
                if(data[dispositivo].Current_client) {
                    var dev = "<button id=\"DeviceSetting\" class=\"btn\"  ng-click=\"setCurDev('"+data[dispositivo].clientId+"')\">"+ deviceType(data[dispositivo].Current_client)+"<p>dispositivo Corrente</p></button>";
                    dev = $compile(dev)($scope);
                    angular.element(deviceSetting).append(dev);

                    console.log("il dispositivo corrente è: " + deviceType(data[dispositivo].Current_client) + "\ncon ID: " + data[dispositivo].clientId);
                }else{
                    var dev = "<button id=\"DeviceSetting\" class=\"btn\" ng-click=\"setCurDev('"+data[dispositivo].clientId+"')\">"+ deviceType(data[dispositivo].client)+"</button>";
                    dev = $compile(dev)($scope);
                    angular.element(deviceSetting).append(dev);

                    console.log("un dispositivo è: " + deviceType(data[dispositivo].client) + "\ncon ID: " + data[dispositivo].clientId);
                }
            }
        }
        $sessionStorage.modalAppear = true;
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
        if(userAgent.match(/Macintosh/i)) return "<i id=\"deviceType\" class=\"fa fa-laptop\"></i><i id=\"osType\" class=\"fa fa-apple\"></i>Mac";
        if(userAgent.match(/Android/i)) return "<i id=\"deviceType\" class=\"fa fa-mobile\"></i><i id=\"osType\" class=\"fa fa-android\"></i>Android";
        if(userAgent.match(/BlackBerry/i)) return "BlackBerry";
        if(userAgent.match(/iPhone/i)) return "iPhone";
        if(userAgent.match(/iPod/i)) return "iPod";
        if(userAgent.match(/iPad/i)) return "iPad";
        if(userAgent.match(/Windows Phone/i)) return "windows Phone";
        if(userAgent.match(/Windows/i)) return "windows";
        if(userAgent.match(/Ubuntu/i)) return "Linux";
    }

    /**
     *
     * funzioni e socket per il player
     *
     */

    $scope.setCurDev = function(currentId){
        socket.emit("setCurrent",{username:$sessionStorage.UserLogged.username,currentId:currentId});
        modalDevice.style.display = "none";
    };

    socket.on('setCurrentDone',function (data) {
        $sessionStorage.deviceSetted = true;
    });

    $scope.loadBrano = function(codbrano,listOfSong,reset){
       // if(audio.src) audio.pause();
        if($sessionStorage.deviceSetted === true) {
            socket.emit('stream', {username: $sessionStorage.UserLogged.username});
            if(reset !== true || reset !== false) reset = true;
            genereteListOfSong(listOfSong,reset);
        }else{
            socket.emit('player_room', {username: $sessionStorage.UserLogged.username});
        }
    };

    function genereteListOfSong(list,reset){
        var listOfSong = [];
        if(list.length > 0){
            for (brani in list){
                listOfSong.push({codice:list[brani].codice,titolo:list[brani].titolo,immagine:list[brani].immagine});
            }
            if($sessionStorage.listOfSong === undefined || $sessionStorage.listOfSong.length === 0 || reset === true){
                $sessionStorage.listOfSong = {current:0,list:listOfSong};
            }else{
                $sessionStorage.listOfSong.list = $sessionStorage.listOfSong.list.concat(listOfSong.filter(function(item){
                    return $sessionStorage.listOfSong.list.indexOf(item) < 0;
                }));
            }
        }
    }
    $scope.getInCoda = function(){
        if($sessionStorage.listOfSong.list) return $sessionStorage.listOfSong.list;
        return [];
    };

    $scope.setCurrentCoda = function(position){
        if($sessionStorage.listOfSong) $sessionStorage.listOfSong.current = position;
    };

    ss(socket.getsocket()).on('audio-stream', function (stream, data) {
        var parts = [];
        stream.on('data', (chunk) => {
            parts.push(chunk);
        });
        stream.on('end', function () {
            audio.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
            audio.play();
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

    function audioEnd(){
        if(!$sessionStorage.loop) $sessionStorage.loop=0;

            if($sessionStorage.loop === 0){
                if($sessionStorage.listOfSong.current + 1 >= $sessionStorage.listOfSong.list.length){
                    audioStop();
                }else{
                    $scope.succ();
                }
            }else if($sessionStorage.loop === 1){
                if($sessionStorage.listOfSong.current + 1 >= $sessionStorage.listOfSong.list.length){
                    $sessionStorage.listOfSong.current = 0;
                    $scope.loadBrano($sessionStorage.listOfSong.list[0].codice,$sessionStorage.listOfSong.list,false);
                }else{
                    $scope.succ();
                }
            }else if($sessionStorage.loop === 2){
                audio.currentTime = 0;
                socket.emit('play', {username: $sessionStorage.UserLogged.username});
               if(audio.src) audio.play();
            }
    }

    function audioStop(){
        socket.emit('pause', {username: $sessionStorage.UserLogged.username});
        audio.currentTime = 0;
    }

    socket.on('updateProgressBar',function(data){
        progressBar.value = data.progress;
        musicTime.innerText = formatTime(data.currentTime);
    });

    $scope.playPause = function(){
            if (playPause.getAttribute('class') === 'fa fa-play' && audio.paused) {
                socket.emit('play', {username: $sessionStorage.UserLogged.username});
                playPause.className = 'fa fa-pause';
                if (!this.getDisable()) playerPlayPause.className = 'fa fa-pause';
            } else {
                socket.emit('pause', {username: $sessionStorage.UserLogged.username});
                playPause.className = 'fa fa-play';
                if (!this.getDisable()) playerPlayPause.className = 'fa fa-play';
            }
    };

    $scope.isPaused = function(){
      return audio.paused;
    };

    $scope.succ = function(){
        socket.emit('succ',{username: $sessionStorage.UserLogged.username});
    };

    $scope.prec = function(){
        socket.emit('prec',{username: $sessionStorage.UserLogged.username});
    };

    $scope.repeatSong= function(){
        if(!$sessionStorage.loop) $sessionStorage.loop = 0;
        if($sessionStorage.loop + 1 > 2){
            $sessionStorage.loop = 0;
        }else{
            $sessionStorage.loop++;
        }
        socket.emit('repeat',{username:$sessionStorage.UserLogged.username,loopCode:$sessionStorage.loop});
    };

    $scope.currentSongName = function(){
        if($sessionStorage.listOfSong) return $sessionStorage.listOfSong.list[$sessionStorage.listOfSong.current].titolo;
    };
    $scope.currentSongImage = function(){
        if($sessionStorage.listOfSong) return $sessionStorage.listOfSong.list[$sessionStorage.listOfSong.current].immagine;

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

    socket.on('successivo',function(data){
        if($sessionStorage.listOfSong) {
            var succ = $sessionStorage.listOfSong.current + 1;
            if ($sessionStorage.loop === 1 && $sessionStorage.listOfSong.current + 1 >= $sessionStorage.listOfSong.list.length) {
                succ = 0;
            } else if ($sessionStorage.loop === 2) {
                succ = $sessionStorage.listOfSong.current;
            } else if ($sessionStorage.listOfSong.current + 1 >= $sessionStorage.listOfSong.list.length) {
                return 0;
            }
            if(audio.src) {
                var codbrano = $sessionStorage.listOfSong.list[succ].codice;
                socket.emit('stream', {username: $sessionStorage.UserLogged.username, codice: codbrano});
            }
            $sessionStorage.listOfSong.current = succ;
        }
    });

    socket.on('precedente',function(data){
        if($sessionStorage.listOfSong) {
            var prec = $sessionStorage.listOfSong.current - 1;

            if ($sessionStorage.listOfSong.current - 1 < 0) {
                prec = 0;
            }
            if(audio.src) {
                var codbrano = $sessionStorage.listOfSong.list[prec].codice;
                socket.emit('stream', {username: $sessionStorage.UserLogged.username, codice: codbrano});
            }
            $sessionStorage.listOfSong.current = prec;
        }
    });

    $scope.getRepeatStyle = function(){
        if(!$sessionStorage.loop) $sessionStorage.loop = 0;
        socket.emit('repeat',{username:$sessionStorage.UserLogged.username,loopCode:$sessionStorage.loop});
    };

    socket.on('repeatSong',function(data){
       $sessionStorage.loop = data;
        if(data === 0) repeatLoop.style.color = "#6d6d6d";
        if(data === 1) repeatLoop.style.color = "#ffffff";
        if(data === 2) repeatLoop.style.color = "red";
    });



    $scope.resizeHome50 = function(){
        main.setAttribute("style","flex:50%;");
        return true;
    };

    $scope.resizeHome70 = function(){
        main.setAttribute("style","flex:70%;");
        return false;
    };
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

    $scope.getUsers= function(){
        if($sessionStorage.users !== undefined) return $sessionStorage.users;
        return [];
    };
})
    .controller('utenteCtrl', function($scope,$http,User,Ascoltati,Seguiti) {
        $scope.utente=User;
        $scope.ascoltati=Ascoltati;
        $scope.seguiti=Seguiti;
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
    /**
     * Sezione Libreria
     */

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
               nomePlaylist = $scope.namePlaylist;//questo la passo sotto per aggiungere i brani
               $scope.playlist.push({codice:response.data.codice, immagine: "/image/playlist"+response.data.codice+".png", nome: response.data.nome});
               $scope.create=false;
               $scope.message=false;
               $scope.apply();
           },function myError(response){
               $scope.message=true;
               $scope.error = response.data;
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
           }).then(function mySucces(response){
               $scope.nomeBrano=selected.title;
           });
       };
    })
    /**
     * vista playlist personale
     */
    .controller('playlistUtCtrl', function ($scope, Playlist, $http,NomePlaylist) {
        $scope.playlistUt=Playlist;
        $scope.nomePlay=NomePlaylist.nome;
        $scope.codPlay = NomePlaylist.codice;

        $scope.visible=false;
        $scope.showBox=function () {
            $scope.visible=true;
        };
        $scope.hideBox=function () {
            $scope.visible=false;
        };

        $scope.delete=function () {
            var parameter = {nome_playlist:NomePlaylist.nome};
            $http({
                method: "POST",
                url: "/require/delete_playlist",
                data: parameter,
                withCredentials: true,
                headers: {'Content-Type': 'application/json'}
            }).then(function mySuccess(response){
               window.location = "#!libreria/playlist"
            },function myError(response){

            });
        };
        $scope.addSong=function (selected) {
            var parameter = {codbrano:selected.originalObject.codice,nome_playlist:NomePlaylist.nome};
            $http({
                method:"POST",
                url : '/require/add_song',
                data: parameter,
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            }).then(function mySuccess(response){
                $scope.nomeBrano=selected.title;//mostro a video la selezione dell'utente
                $scope.playlistUt.push(selected.originalObject);
                $scope.apply();
            },function myError(response){
                $scope.nomeBrano= "non è stato possibile caricare "+selected.title;
            });

        };

    })
    .controller('tueCanzoniCtrl', function ($scope, Saved){
        $scope.salvate=Saved;
    })
    .controller('recentiCtrl', function ($scope, Recenti){
        $scope.recenti=Recenti;
    })

    /**
     * sezione Amici
     */
    .controller('amiciCtrl', function ($scope, Amici) {
        $scope.amici=Amici;
    })

    /**
     * pagina Artista
     */

    .controller('artistaCtrl', function ($scope, $http,Artista, AlbumArtista){
        $scope.artista=Artista;
        $scope.Album=AlbumArtista;
        $scope.isFollowed=Artista.followed;

        $scope.addArtista = function () {
            $http({
                method : "POST",
                url : 'require/follow_artista',
                data: {codartista:Artista.codice},
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
                data: {codartista:Artista.codice},
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function mySuccess(response) {
                $scope.isFollowed = false;
            })
        };

        /**
         * Sezione Generi e mood
         */
    })
    .controller('moodCtrl', function ($scope, Mood,Genere) {
      //$scope.mood=Mood;
      //$scope.genere = Genere;
        var slides = [];
        for (playlist in Mood){
            slides.push({nome:Mood[playlist].nome,immagine:Mood[playlist].immagine,codice:Mood[playlist].codice});
            console.log("Il nome è: "+Mood[playlist]);
        }
      $scope.slides = slides;
    })

    /**
     * sezione Preferiti
     */
    .controller('artistiPrefCtrl', function ($scope, ArtistiPreferiti){
      $scope.preferiti=ArtistiPreferiti;
    })

    .controller('sceltiCtrl', function ($scope) {

    })
    .controller('piuAscoltatiCtrl', function ($scope,PiuAscoltate) {
      $scope.topBrani=PiuAscoltate;

    })
    /**
     * homepage
     */
    .controller('homeCtrl', function ($scope, Giornaliera, Recently, AmiciSong) {
       $scope.playlistG=Giornaliera;
       $scope.recently=Recently;
       $scope.musicFriends=AmiciSong;
    })
    /**
     * Search bar
     */
    .controller('searchCtrl', function($scope){
 //console.log(selected);
        $scope.reindirizza=function(selected){
            console.log(selected.originalObject.val.type);

            if(selected.originalObject.val.type==='Brano: ') {

                loadBrano(selected.originalObject.val.original.codice)
            }else if (selected.originalObject.val.type==='Artista: ') {
                window.location="#!artista/" + selected.originalObject.val.original.codice;
                }
                else if(selected.originalObject.val.type==='Album: '){
                window.location="#!album/"+ selected.originalObject.val.original.codice;
            }
            else{
                window.location="#!utente/"+selected.originalObject.val.original.username;
            }
        };

        /**
         * Player musicale
         */
    })
    .controller('playerCtrl', function($scope,$http){
        $scope.salvaBrano=function (codice) {
            $scope.codice=codice;
            var parameter={codbrano:$scope.codice};
            $http({
                method:"POST",
                url : '/require/setPreferito',
                data: parameter,
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    })
    /**
     * Sezione album
     */
    .controller('albumCtrl', function($scope,$http,Album, BraniAlbum, ListaPlaylist){
        $scope.album=Album;
        $scope.brani=BraniAlbum;
        $scope.lista=ListaPlaylist;
        //$scope.altri=AltriAlbum;

        //gestisco la dropdown per le playlist
        $scope.showDrop=function (codice) {
            if($scope.codice!==codice){
                $scope.codice=codice
            }else{
                $scope.codice=-1;
            }
        };
        $scope.hideDrop=function () {
            $scope.visible=false;
        };

        $scope.aggiungi=function (nome,codice) {
            $scope.nome=nome;
            var parameter={nome_playlist:$scope.nome,codbrano:$scope.codice};
            $http({
                method:"POST",
                url : '/require/add_song',
                data: parameter,
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
        };
        $scope.salvaBrano=function (codice) {
            $scope.codice=codice;
            var parameter={codbrano:$scope.codice};
            $http({
                method:"POST",
                url : '/require/setPreferito',
                data: parameter,
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
        }


    });
