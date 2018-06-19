angular.module('PlayAround')
    .factory('socket', function ($rootScope) {
    var socket = io.connect('http://127.0.0.1:1337', {'forceNew': true});
    return {
        runSocket: function(){
            socket = io.connect('http://127.0.0.1:1337', {'forceNew': true});
            return socket.connected();
        },
        isConnected: function(){
            if(socket.connected === false) return socket.runSocket();
            return socket.connected;
        },
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            if(socket.isConnected()) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        }
    };
})

