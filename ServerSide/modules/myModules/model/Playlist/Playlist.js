var connection = require("../../dbconnection/setup.js");
var GetHash = require('../../HashGenerator/HashGeneretor');

module.exports ={

  playlist_giornaliera: function (giorno,ora,callback){
      connection.getConnection(function (err,connection){
         if(err)  {
             connection.release();
             return callback(err,null,1);
         }
         var sql = "SELECT CODPLAYLIST,NOME FROM PLAYLIST_DEF WHERE MOOD = '1'";
          connection.query(sql, function(err, results) {
              if (err) {
                  connection.release();
                  return callback(err, null, 2);
              }
              connection.release();
              return callback(null,results,0);
          });
      });
  },


    get_brani_playlist: function (codPlaylist,callback){
        connection.getConnection(function (err,connection){
            if(err) {
                connection.release();
                return callback(err,null,1);
            }
            var sql = "SELECT CODBRANO,TITOLO,IMMAGINE FROM BRANI WHERE CODBRANO IN (SELECT CODBRANO FROM PLAYLIST_BRANI WHERE CODPLAYLIST = ?)";
            connection.query(sql,[codPlaylist], function(err, results) {
                if (err){
                    connection.release();
                    return callback(err, null, 2);
                }
                connection.release();
                return callback(null,results,0);
            });
        });
    },

    get_playlist_utente: function (username,callback){
        connection.getConnection(function (err,connection){
            if(err)  {
                connection.release();
                return callback(err,null,1);
            }
            var sql = "SELECT CODUTENTE FROM UTENTI WHERE USERNAME = ?";
            connection.query(sql,[username], function(err, results) {
                if(results.length === 0 || err) {
                    connection.release();
                    return callback('err',null,2);
                }
                sql = "SELECT CODPLAYLIST,NOME_PLAYLIST FROM PLAYLIST_UT WHERE CODUTENTE = ?";
                connection.query(sql,[results[0].CODUTENTE], function(err, results) {
                    if (err || results.length === 0) {
                        connection.release();
                        return callback('err', null, 3);
                    }
                    connection.release();
                    return callback(null,results,0);
                });
            });
        });
    },

    new_playlist: function (email,nomePlaylist,callback){
        connection.getConnection(function (err,connection) {
            if (err) {
                connection.release();
                return callback(err, null, 1);
            }
            var sql = "INSERT INTO PLAYLIST VALUES ('0')";
            connection.query(sql,function (err,results) {
                if(err) {
                    connection.release();
                    return callback(err,null,2);
                }
                var id = results.insertId;
                sql = "INSERT INTO PLAYLIST_UT (CODPLAYLIST,CODUTENTE,NOME_PLAYLIST) VALUES (?,?,?)";
                connection.query(sql,[id,GetHash.GetCodUtente(email),nomePlaylist], function(err, results) {
                    if(err) {
                        connection.release();
                        return callback(err,null,3);
                    }
                    connection.release();
                    return callback(null,results,0);
                });
            });
        });
    },

    delete_playlist: function (email,nomePlaylist,callback){
        connection.getConnection(function (err,connection) {
            if (err) {
                connection.release();
                return callback(err, null, 1);
            }
            var sql = "SELECT CODPLAYLIST FROM PLAYLIST_UT WHERE CODUTENTE = ? AND NOME_PLAYLIST = ?";
            connection.query(sql,[GetHash.GetCodUtente(email),nomePlaylist], function(err, results) {
                if(results.length === 0 || err) {
                    connection.release();
                    return callback('err',null,2);
                }
                sql = "DELETE FROM PLAYLIST WHERE CODPLAYLIST = ?";
                connection.query(sql,[results[0]], function(err, results) {
                    if(err) {
                        connection.release();
                        return callback(err,null,3);
                    }
                    connection.release();
                    return callback(null,results,0);
                });
            });
        });
    },

    add_song_playlist: function (email,nomePlaylist,codbrano,callback){
        connection.getConnection(function (err,connection) {
            if (err) {
                connection.release();
                return callback(err, null, 1);
            }
            var sql = "SELECT CODPLAYLIST FROM PLAYLIST_UT WHERE CODUTENTE = ? AND NOME_PLAYLIST = ?";
            connection.query(sql,[GetHash.GetCodUtente(email),nomePlaylist], function(err, results) {
                if(results.length === 0 || err) {
                    connection.release();
                    return callback('err',null,2);
                }
                sql = "INSERT INTO PLAYLIST_BRANI(CODPLAYLIST,CODBRANO) VALUES (?,?)";
                connection.query(sql,[results[0].CODPLAYLIST,codbrano], function(err, results) {
                    if(err) {
                        connection.release();
                        return callback(err,null,3);
                    }
                    connection.release();
                    return callback(null,results,0);
                });
            });
        });
    },

    delete_song_playlist: function (email,nomePlaylist,codbrano,callback){
        connection.getConnection(function (err,connection) {
            if (err) {
                connection.release();
                return callback(err, null, 1);
            }
            var sql = "SELECT CODPLAYLIST FROM PLAYLIST_UT WHERE CODUTENTE = ? AND NOME_PLAYLIST = ?";
            connection.query(sql,[GetHash.GetCodUtente(email),nomePlaylist], function(err, results) {
                if(results.length === 0 || err) {
                    connection.release();
                    return callback('err',null,2);
                }
                sql = "DELETE FROM PLAYLIST_BRANI WHERE CODPLAYLIST = ? AND CODBRANO = ?";
                connection.query(sql,[results[0].CODPLAYLIST,codbrano], function(err, results) {
                    if(err) {
                        connection.release();
                        return callback(err,null,3);
                    }
                    connection.release();
                    return callback(null,results,0);
                });
            });
        });
    }
};