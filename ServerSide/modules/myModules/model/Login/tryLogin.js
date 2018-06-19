var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports ={
    LoginUser: function(user, callback)
    {
        connection.getConnection(function (err,connection) {
            if (err) return callback(err,null,1);
            var sql = "SELECT * FROM UTENTI WHERE CODUTENTE = ?";

            connection.query(sql, [GetHash.GetCodUtente(user.email)], function(err, results) {
                if (err) {
                    connection.release();
                    return callback(err, null,1);
                }

                if(results.length !== 1){
                    connection.release();
                    return callback("err", null, 2);
                } else {
                    if (results[0].CONFIRMED === 0) {
                        connection.release();
                        return callback("err", null, 3);
                    }
                    if (results[0].PASSWORD !== GetHash.GetPassword(user.password)) {
                        connection.release();
                        return callback("err", null, 4);
                    }
                    connection.release();
                    return callback(null, results[0], 0);
                }
            });
        });
    }
};