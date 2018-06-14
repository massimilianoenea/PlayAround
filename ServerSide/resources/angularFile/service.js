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




        };
    })
    .factory('socket', function ($rootScope) {
    var socket = io.connect('http://127.0.0.1:1337', {'forceNew': true});
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
