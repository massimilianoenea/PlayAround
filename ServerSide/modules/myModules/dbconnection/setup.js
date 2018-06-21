var mysql = require ("mysql");

if(process.env.PORT){
   var con = mysql.createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB
    });
}else{
  var con = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "JuventusStadium1996",
        database: "playaround"
    });
};
module.exports = exports = con;
