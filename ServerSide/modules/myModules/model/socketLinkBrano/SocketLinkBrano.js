var connection = require("../../dbconnection/setup.js");

module.exports = {
  getLink : function (codice,callback){
      connection.getConnection(function (err, connection) {
          if (err) return callback(err, null, 1);

          var sql = "SELECT LINK,TITOLO FROM BRANI WHERE CODBRANO = ?";

          connection.query(sql, [codice], function (err, results) {
              if (err) return callback(err, null, 2);
              return callback(null, results, 0);
          });
      });
  }
};