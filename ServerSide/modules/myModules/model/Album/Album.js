var connection = require("../../dbconnection/setup.js");

module.exports = {
    get_album : function (codalbum,callback){
        connection.getConnection(function (err, connection) {
            if (err){
                return callback(err, null, 1);
            }
            var sql = "SELECT CODALBUM,TITOLO,ANNO,IMMAGINE FROM ALBUM WHERE CODALBUM = ?";
            connection.query(sql, [codalbum], function (err, results) {
                if (err) {
                    return callback(err, null, 2);
                }
                connection.release();
                return callback(null, results, 0);
            });
        });
    },

  get_brani_album : function (codalbum,callback){
      connection.getConnection(function(err,connection){
        if (err){
            return callback(err,null,1);
        }
        var sql = "SELECT b.codbrano as codice, b.titolo as titolo, b.anno as anno, b.immagine as immagine, al.titolo as album, ar.nome as artista FROM BRANI b, artista ar, album al WHERE al.codalbum = b.codalbum and ar.codartista = b.codartista and b.CODALBUM = ?";
          connection.query(sql,[codalbum],function (err,results) {
              if(err){
                  return callback(err,null,2);
              }
              connection.release();
              return callback(null,results,0);
          });
      });
  },
    get_altro_artista: function(codartista,callback) {
        connection.getConnection(function (err, connection) {
            if (err) {
                return callback(err, null, 1);
            }
            var sql = "SELECT CODALBUM,TITOLO,ANNO,IMMAGINE FROM ALBUM WHERE CODALBUM IN(SELECT CODALBUM FROM BRANI WHERE CODARTISTA LIKE ?)";
            connection.query(sql, [codartista], function (err, results) {
                if (err) {
                    return callback(err, null, 2);
                }
                connection.release();
                return callback(null, results, 0);
            });
        });
    }
};