angular.module('PlayAround', ['ngRoute','ngStorage','angucomplete-alt'])

/* Routing  autoCompleteModule' ,'ngSanitize'*/

.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/public/templates/home.html",
            controller:"homeCtrl",
            resolve:{
                Giornaliera: function ($http) {
                    var data =new Date();
                    return $http.get('/require/playlist_giornaliera/'+ data)
                        .then(function (response){
                            return response.data;
                        });
                    },
                    Recently: function ($http) {
                        return $http.get('/require/ascoltati_recente')
                            .then(function (response){
                                return response.data;
                            });
                    },
                    AmiciSong: function ($http) {
                        return $http.get('/require/ascoltano_amici')
                            .then(function (response){
                                return response.data;
                            });
                    }
            }
        })
        .when("/amiciOn",{
            templateUrl:"/public/templates/amiciOn.html",
            controller: "amiciOnCtrl"
        })
        .when("/utente/:username",{
            templateUrl:"/public/templates/utente.html",
            controller:"utenteCtrl",
            resolve:  {
                User: function($http, $route){
                    return $http.get('require/utente/' + $route.current.params.username)
                        .then(function(response){
                            return response.data;
                        })
                }
            }

        })
        .when("/libreria/playlist",{
            templateUrl:"/public/templates/playlist.html",
            controller:"playlistCtrl",
            resolve: {
                PersonalPlaylist: function ($http) {
                    return $http.get('/require/le_tue_playlist')
                        .then(function (response) {
                            return response.data;
                        });
                }
            }
        })
        .when("/libreria/leTueCanzoni", {
            templateUrl: "/public/templates/leTueCanzoni.html",
            controller: "tueCanzoniCtrl",
            resolve: {
                Saved: function ($http) {
                    return $http.get('/require/canzoni_salvate')
                        .then(function (response) {
                            return response.data;
                        });
                }
            }
        })
        .when("/libreria/ascoltatiRecente", {
            templateUrl: "/public/templates/ascoltatiRecente.html",
            controller: "recentiCtrl",
            resolve: {
                Recenti: function ($http) {
                    return $http.get('/require/ascoltate_recente')
                        .then(function (response) {
                            return response.data;
                        });
                }
            }
        })
        .when("/libreria/playlist/:codice",{
            templateUrl: "public/templates/playlist_Ut.html",
            controller:"playlistUtCtrl",
            resolve:{
                Playlist: function ($http, $route) {
                    return $http.get("/require/get_brani_playlist/" + $route.current.params.codice)
                        .then(function (response) {
                            //return JSON.stringify({nome:$scope.nomePlaylist,response:response.data});
                            return response.data;
                        })
                }
            }
        })


        .when("/artista/:id",{
            templateUrl: "/public/templates/artista.html",
            controller: "artistaCtrl",
            resolve:  {
                Artista: function($http, $route){
                    return $http.get('/require/artista/'+ $route.current.params.id)
                        .then(function(response){
                            return response.data;
                        })
                },
                SongArtista:function($http, $route){
                    return $http.get('/require/canzoni_ascoltate/'+ $route.current.params.id)
                        .then(function(response){
                            return response.data;
                        })
                },
                AlbumArtista:function($http, $route){
                    return $http.get('/require/get_altro_artista/'+ $route.current.params.id)
                        .then(function(response){
                            return response.data;
                        })
                }
                }
        })

        .when("/player",{
                templateUrl:"/public/templates/player.html",
                controller: "playerCtrl"

        })


        .when("/preferiti",{
            templateUrl: "/public/templates/artisti.html",
            controller: "artistiPrefCtrl",
            resolve: {
                ArtistiPreferiti: function ($http) {
                    return $http.get('/require/artisti_seguiti')
                        .then(function (response) {
                            return response.data;
                        });
                }
            }

        })
        .when("/amici",{
            templateUrl: "/public/templates/amici.html",
            controller: "amiciCtrl",
            resolve: {
                Amici: function ($http) {
                    return $http.get('/require/get_amici')
                        .then(function (response) {
                            return response.data;
                        });
                }
            }

        })

        .when("/sceltiPerTe",{
                templateUrl:"/public/templates/sceltiPerTe.html",
                controller: "sceltiCtrl",
                resolve: {
                    Scelti: function ($http) {
                        return $http.get('/require/')
                            .then(function (response) {
                                return response.data;
                            });
                    }
                }

        })
        .when("/piuAscoltati",{
                templateUrl:"/public/templates/piuAscoltati.html",
                controller:"piuAscoltatiCtrl",
                resolve: {
                    PiuAscoltate: function ($http) {
                        return $http.get('/require/piu_ascoltate')
                            .then(function (response) {
                                return response.data;
                            });
                    }
                }

        })
        .when("/mood",{
                templateUrl:"/public/templates/mood.html",
                controller:"moodCtrl",
                resolve: {
                    Mood: function ($http) {
                        return $http.get('/require/')
                            .then(function (response) {
                                return response.data;
                            });
                    }
                }

        })

        .when("/album/:codAlbum",{
                templateUrl: "/public/templates/album.html",
                controller: "albumCtrl",
                resolve:  {
                    Album: function($http, $route){
                        return $http.get('/require/get_album/'+ $route.current.params.codAlbum)
                            .then(function(response){
                                return response.data;
                            })
                    },
                    BraniAlbum: function($http, $route){
                        return $http.get('/require/get_brani_album/' + $route.current.params.codAlbum)
                            .then(function(response){
                                return response.data;
                            })
                    }

                   /*AltriAlbum: function($http){
                        return $http.get('/get_altro_artista/')
                            .then(function(response){
                                return response.data;
                            })
                    }*/
                }

        })
        .otherwise({
            template: "/public/templates/home.html",
            controller:"homeCtrl",
            resolve:{
                Giornaliera: function ($http) {
                    var data =new Date();
                    return $http.get('/require/playlist_giornaliera/'+ data)
                        .then(function (response){
                            return response.data;
                        });
                },
                Recently: function ($http) {
                    return $http.get('/require/ascoltati_recente')
                        .then(function (response){
                            return response.data;
                        });
                },
                AmiciSong: function ($http) {
                    return $http.get('/require/ascoltano_amici')
                        .then(function (response){
                            return response.data;
                        });
                }
            }
        })
});

