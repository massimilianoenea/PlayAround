var http = require('http');
var HttpDispatcher = require('../node_modules/httpdispatcher/httpdispatcher');
var dispatcher = new HttpDispatcher();

dispatcher.setStatic('/resources');
dispatcher.setStaticDirname('static');

dispatcher.onGet("/page1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page One');
});

http.createServer(function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end('Hello World');
}).listen(1337,'127.0.0.1');

console.log('listen on 8000');