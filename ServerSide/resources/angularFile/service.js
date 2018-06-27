angular.module('PlayAround')
    .factory('socket', function ($rootScope) {
        var path = window.location.protocol+"//"+ window.location.host;
        var socket = io.connect(path, {'forceNew': true});
    return {
        runSocket: function(){
            socket = io.connect(path, {'forceNew': true});
            return socket.connected;
        },
        isConnected: function(){
            if(socket.connected === false) return this.runSocket();
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
            if(this.isConnected()) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        },
        getsocket: function(){
            return socket;
        }
    };
});

