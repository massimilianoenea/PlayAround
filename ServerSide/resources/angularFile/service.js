angular.module('PlayAround')
    .factory('listaOn', function ($http) {

        var users = [];

        return {
            users: users,

            load: function () {
                return $http
                    .get('http://jsonplaceholder.typicode.com/users')
                    .then(function (data) {
                        users.push.apply(users, data.data);
                    });

            },
            loadSingle: function (id) {
                return $http.get('http://jsonplaceholder.typicode.com/users/' + id);

            }

        };
    })
    .factory('listaAmici', function ($http) {

        var users = [];

        return {
            users: users,

            load: function () {
                return $http
                    .get('http://jsonplaceholder.typicode.com/users')
                    .then(function (data) {
                        users.push.apply(users, data.data);
                    });

            },
            loadSingle: function (id) {
                return $http.get('http://jsonplaceholder.typicode.com/users/' + id);

            }

        };
    });
