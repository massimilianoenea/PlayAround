var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports = {
    amici_online : function(email,callback){
        connection.getConnection(function (err,connection) {
            if (err) return callback(err,null,1);

            var sql = "SELECT U.USERNAME,L.CODBRANO FROM UTENTI U, UTENTI_LOGGATI L WHERE U.CODUTENTE LIKE L.CODUTENTE AND L.CODUTENTE IN (SELECT CODUTENTE_AMICO FROM UTENTI_AMICI WHERE CODUTENTE LIKE ?)";

            connection.query(sql, [GetHash.GetCodUtente(email)], function(err, results) {
                if (err) return callback(err, null,2);
                return callback(null,results,0);
            });
        });
    },

    utenti_online : function(email,callback){
        connection.getConnection(function (err,connection) {
            if (err) return callback(err,null,1);

            var sql = "SELECT U.USERNAME,L.CODBRANO FROM UTENTI U, UTENTI_LOGGATI L WHERE U.CODUTENTE LIKE L.CODUTENTE AND L.CODUTENTE NOT LIKE ? AND L.CODUTENTE NOT IN (SELECT CODUTENTE_AMICO FROM UTENTI_AMICI WHERE CODUTENTE LIKE ?)";

            connection.query(sql, [GetHash.GetCodUtente(email),GetHash.GetCodUtente(email)], function(err, results) {
                if (err) return callback(err, null,2);
                return callback(null,results,0);
            });
        });
    }
};