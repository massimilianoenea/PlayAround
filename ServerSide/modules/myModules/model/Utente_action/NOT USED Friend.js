var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports = {
    GetAmici: function (email, callback) {
        connection.getConnection(function (err, connection) {
            if (err) return callback(err, null, 1);

            var sql = "SELECT USERNAME FROM UTENTI WHERE CODUTENTE IN (SELECT CODUTENTE_AMICO FROM UTENTI_AMICI WHERE CODUTENTE LIKE ?)";

            connection.query(sql, [GetHash.GetCodUtente(email)], function (err, results) {
                if (err) return callback(err, null, 2);
                return callback(null, results, 0);
            });
        });
    }
};