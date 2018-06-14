var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports = {

    get_utente:function(username,email,callback){
      connection.getConnection(function(err,connection){
          if (err) return callback(err,null,1);
          var sql = "SELECT CODUTENTE,USERNAME FROM UTENTI WHERE USERNAME = ? LIMIT 1";
          connection.query(sql,[username],function (err,results) {
              var res = results;
             if(err || results.length === 0) return callback('err',null,2);
             sql = "SELECT * FROM UTENTI_AMICI WHERE CODUTENTE_AMICO LIKE ? AND CODUTENTE LIKE ?";
             connection.query(sql,[res[0].CODUTENTE,GetHash.GetCodUtente(email)],function(err,results){
                if(err) return callback(err,null,3);
                if(results.length === 0)return callback(null,res,0);
                return callback(null,res,1);
             });
          });
      });
    },

    get_amici:function(email,callback){
        connection.getConnection(function(err,connection){
            if (err) return callback(err,null,1);
            var sql = "SELECT USERNAME,CODUTENTE FROM UTENTI WHERE CODUTENTE IN (SELECT CODUTENTE_AMICO FROM UTENTI_AMICI WHERE CODUTENTE LIKE ?)";
            connection.query(sql,[GetHash.GetCodUtente(email)],function (err,results) {
                if(err || results.length === 0) return callback('err',null,2);
                return callback(null,results,0);
            });
        });
    },

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
    },

    Delete_amico : function(email,username_amico,callback){
        connection.getConnection(function (err,connection) {
            if (err) return callback(err,null,1);

            var sql = "SELECT CODUTENTE FROM UTENTI WHERE USERNAME LIKE ?";
            connection.query(sql,[username_amico],function(err,results){
                if(err) return callback(err,null,2);
                if(results.length === 1){
                    sql = "DELETE FROM UTENTI_AMICI WHERE CODUTENTE LIKE ? AND CODUTENTE_AMICO LIKE ?";
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