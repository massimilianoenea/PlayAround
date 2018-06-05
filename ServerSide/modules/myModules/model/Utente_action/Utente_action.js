var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports = {
  Add_amico : function(email,username_amico,callback){
      connection.getConnection(function (err,connection) {
          if (err) return callback(err,null,1);

          var sql = "SELECT CODUTENTE FROM UTENTI WHERE USERNAME LIKE ?";
          connection.query(sql,[username_amico],function(err,results){
              if(err) return callback(err,null,2);
                if(results.length === 1){
                      sql = "INSERT INTO UTENTI_AMICI VALUES (?,?)";
                      connection.query(sql, [GetHash.GetCodUtente(email),results[0].CODUTENTE], function(err, results) {
                          if (err) return callback(err, null, 2);
                          return callback(null, results, 0);
                      });
                }else{
                    return callback(err, null, 2);
                }
          });
      });
  }
};