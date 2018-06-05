var mysql = require ("mysql");

var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "always",
    database: "playaround"
});
module.exports = exports = con;