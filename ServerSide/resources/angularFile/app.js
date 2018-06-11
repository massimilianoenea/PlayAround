angular.module('PlayAround', ['ngRoute'])

/* Routing */

.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/public/templates/home.html"
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
            controller: ""
        })
        .when("/libreria/ascoltatiRecente", {
            templateUrl: "/public/templates/ascoltatiRecente.html",
            controller: ""
        })


        .when("/artista/:id",{
            templateUrl: "/public/templates/artista.html",
            controller: ""

        })
        /*
        .when("/home",{
                templateUrl:"/public/templates/home.html",
                controller: "homeCtrl"

        })

        .when("/libreria/salvate",{
            templateUrl: "/public/templates/",
            controller: ""

        })
        .when("/",{
            templateUrl: "/public/templates/",
            controller: ""

        })
        .when("/",{
            templateUrl: "/public/templates/",
            controller: ""

        })

        .when("/preferiti",{
            templateUrl: "/templates/preferiti.html",
            controller: "preferitiCtrl"

        })
        .when("/amici",{
                templateUrl:"/templates/amici.html",
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
        .when("/artista",{
                templateUrl:"/templates/artista.html",
                controller:"artistaCtrl"

        })
        .when("/album",{
                templateUrl: "/templates/album",
                controller: ""

            })
        .when("/",{
                templateUrl: "/templates/",
                controller: ""

        })*/
});
