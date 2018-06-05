var connection = require("../../dbconnection/setup.js");
var mailSender =  require('../../SenderMail/SenderEmail.js');
var GetHash = require('../../HashGenerator/HashGeneretor');


module.exports = {

    ConfirmRegistration: function(token,callback)

    {
        connection.getConnection(function(err,connection){
           if(err) return callback(err,null,1);

           var sql = "SELECT CODUTENTE FROM UTENTI_APPEND WHERE TOKEN ='"+token+"'";
           connection.query(sql,function (err,results){
               if (err) return callback(err,null,2);

               if (results.length === 1){
                   var codutente = results[0].CODUTENTE;
                   sql = "UPDATE UTENTI SET CONFIRMED = '1' WHERE CODUTENTE = '"+codutente+"'";

                   connection.query(sql,function(err,results){
                       if(err) return callback(err,null,3);
                        sql = "DELETE FROM UTENTI_APPEND WHERE CODUTENTE = '"+codutente+"'";

                        connection.query(sql,function(err,results) {
                           if (err) return callback(err, null,3);
                           connection.release();
                           return callback(null,results,0);
                       });

                   });

               }else{
                   return callback("err",null,2);
               }
           });

        });
    },


    InsertUser: function(user, callback)

    {
        connection.getConnection(function (err,connection) {
            if (err) return callback(err,null,1);
            var tok = GetHash.GetToken(user.email);

            var sql = "INSERT INTO UTENTI_APPEND(CODUTENTE,TOKEN,DATA_INVIO) VALUES (?,?,null)";
            connection.query(sql, [GetHash.GetCodUtente(user.email), tok], function(err, results) {

                if (err) return callback(err, null,2);

                sql = "INSERT INTO UTENTI(EMAIL,CODUTENTE,CODUTENTE_SPAN,USERNAME,PASSWORD,CONFIRMED) VALUES (?,?,?,?,?,?)";
                var paramater = [user.email,GetHash.GetCodUtente(user.email), GetHash.GetCodUtente_span(user.email),user.username,GetHash.GetPassword(user.password),0];
                connection.query(sql, paramater, function(err, results) {

                    if (err) {

                        sql = "DELETE FROM UTENTI_APPEND WHERE CODUTENTE = '"+GetHash.GetCodUtente(user.email)+"'";
                        connection.query(sql);
                        return callback(err, null,3);

                    }

                    mailSender.sendMail(mailSender.SetmailOptions(user.email,tok));
                    connection.release();
                    return callback(null,results,0);

                });
            });

        });
    }
};