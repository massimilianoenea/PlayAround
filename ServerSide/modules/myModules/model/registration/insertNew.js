var connection = require("../../dbconnection/setup.js");
var mailSender =  require('../../SenderMail/SenderEmail.js');
var GetHash = require('../../HashGenerator/HashGeneretor');


module.exports = {

    ConfirmRegistration: function(token,callback)

    {
        connection.getConnection(function(err,connection){
           if(err) {
               return callback(err,null,1);
           }

           var sql = "SELECT CODUTENTE FROM UTENTI_APPEND WHERE TOKEN ='"+token+"'";
           connection.query(sql,function (err,results){
               if (err) {
                   return callback(err,null,2);
               }
               if (results.length === 1){
                   var codutente = results[0].CODUTENTE;
                   sql = "UPDATE UTENTI SET CONFIRMED = '1' WHERE CODUTENTE = '"+codutente+"'";

                   connection.query(sql,function(err,results){
                       if(err) {
                           return callback(err,null,3);
                       }
                        sql = "DELETE FROM UTENTI_APPEND WHERE CODUTENTE = '"+codutente+"'";

                        connection.query(sql,function(err,results) {
                           if (err) {
                               return callback(err, null,3);
                           }
                           connection.release();
                           return callback(null,results,0);
                       });

                   });

               }else{
                   connection.release();
                   return callback("err",null,2);
               }
           });

        });
    },


    InsertUser: function(user,url, callback)

    {
        connection.getConnection(function (err,connection) {
            if (err) {
                return callback(err,null,1);
            }

            var tok = GetHash.GetToken(user.email);
            var sql = "INSERT INTO UTENTI(EMAIL,CODUTENTE,CODUTENTE_SPAN,USERNAME,PASSWORD,CONFIRMED,COMPLETED) VALUES (?,?,?,?,?,?,?)";
            var paramater = [user.email,GetHash.GetCodUtente(user.email), GetHash.GetCodUtente_span(user.email),user.username,GetHash.GetPassword(user.password),0,0];
            connection.query(sql, paramater, function(err, results){
                if (err) {
                    return callback(err, null,3);
                }

                 sql = "INSERT INTO UTENTI_APPEND(CODUTENTE,TOKEN) VALUES (?,?)";
                connection.query(sql, [GetHash.GetCodUtente(user.email), tok], function(err, results) {
                    if (err) {
                        return callback(err,null,2);
                    }
                    mailSender.sendMail(mailSender.SetmailOptions(user.email,url,tok));
                    connection.release();
                    return callback(null,results,0);
                });
            });
        });
    }
};