angular.module('PlayAround', ['ngRoute','ngStorage'])

/* Routing */

.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/public/templates/home.html",
            controller:"homeCtrl"
        })
        .when("/amiciOn",{
            templateUrl:"/public/templates/amiciOn.html",
            controller: "amiciOnCtrl"
        })
        .when("/utente/:username",{
            templateUrl:"/public/templates/utente.html",
            controller:"utenteCtrl",
            resolve:  {
                User: function($http, $routeParams){
                    return $http.get('/webApp/amicoOn/username')
                        .then(function(response){
                            return response.data;
                        })
                }
            }

        })
        .when("/libreria/playlist",{
            templateUrl:"/public/templates/playlist.html",
            controller:"playlistCtrl"

        })
        .when("/libreria/leTueCanzoni", {
            templateUrl: "/public/templates/leTueCanzoni.html",
            controller: "tueCanzoniCtrl"
        })
        .when("/libreria/ascoltatiRecente", {
            templateUrl: "/public/templates/ascoltatiRecente.html",
            controller: "recentiCtrl"
        })


        .when("/artista/:id",{
            templateUrl: "/public/templates/artista.html",
            controller: "artistaCtrl",
            resolve:  {
                User: function($http, $routeParams){
                    return $http.get('/webApp/artista/username')
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
            templateUrl: "/public/templates/amici.html",
            controller: "artistiPrefCtrl"

        })
        .when("/amici",{
            templateUrl: "/public/templates/amici.html",
            controller: "amiciCtrl"

        })

        .when("/sceltiPerTe",{
                templateUrl:"/templates/sceltiPerTe.html",
                controller: "sceltiCtrl"

        })
        .when("/piuAscoltati",{
                templateUrl:"/templates/piuAscoltati.html",
                controller:"piuAscoltatiCtrl"

        })
        .when("/mood",{
                templateUrl:"/templates/mood.html",
                controller:"moodCtrl"

        })



        .when("/album",{
                templateUrl: "/templates/album.html",
                controller: "albumCtrl"

        })
        .otherwise({
            template: "/templates/home.html",
            controller:"homeCtrl"
        })
});

