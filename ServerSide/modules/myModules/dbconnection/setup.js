var mysql = require ("mysql");

var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "JuventusStadium1996",
    database: "playaround"
});
module.exports = exports = con;