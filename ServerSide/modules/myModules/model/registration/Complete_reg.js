var connection = require("../../dbconnection/setup.js");
module.exports = {
  find_artist: function(searched,callback){
      connection.getConnection(function(err,connection){
         if (err) return callback(err,null,1);
         var sql = "SELECT NOME,NOME_ARTE,CODARTISTA AS COD FROM ARTISTA WHERE NOME LIKE ? ORDER BY LEVENSHTEIN(NOME,?)";
          connection.query(sql,[searched,searched],function (err,results) {
              if (err) return callback(err, null, 2);
              return callback(null,results,0);
          });
      });
  },

    find_genere: function(searched,callback){
        connection.getConnection(function(err,connection){
            if (err) return callback(err,null,1);
            var sql = "SELECT NOME,CODGENERE AS COD FROM GENERE WHERE NOME LIKE ? ORDER BY LEVENSHTEIN(NOME,?)";
            connection.query(sql,[searched,searched],function (err,results) {
                if (err) return callback(err, null, 2);
                return callback(null,results,0);
            });
        });
    },

    complete_reg: function (Artist_Array,Genere_Array,callback){
        connection.getConnection(function(err,connection){
            console.log(Artist_Array);
            if (err) return callback(err,null,1);
            var genErr;
            var sql = "INSERT IGNORE INTO FOLLOW_ARTISTI (CODUTENTE,CODARTISTA) VALUES ?";
            var sql2 = "INSERT IGNORE INTO FOLLOW_GENERE (CODUTENTE,CODGENERE) VALUES ?";
            connection.query(sql,[Artist_Array],function (err,results) {
                if (err) genErr = err;
            });
            connection.query(sql2,[Genere_Array],function (err,results) {
                if (err) genErr = err;
            });
            if(genErr) return callback(genErr,null,1);
            return callback(null,'',0);
        });
    },
    flag_complete_reg:function(codutente,callback){
      connection.getConnection(function (err,connection){
          if(err) return callback(err,null,1);
          var sql = "UPDATE UTENTI SET COMPLETED = '1' WHERE CODUTENTE = ?";
          connection.query(sql,[codutente],function (err,results) {
              if (err) return callback(err,null,2);
              return callback(null,'',0);
          });
      });
    }
};