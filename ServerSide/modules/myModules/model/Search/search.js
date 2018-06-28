var connection = require("../../dbconnection/setup.js");

module.exports = {
  get_search: function(searched,callback){
      searched = "%"+searched+"%";
      connection.getConnection(function(err,connection) {
          if (err) {
              return callback(err, null, 1);
          }
          var json = [];

          var sql =  "select codbrano as codice, anno as anno, immagine as immagine, titolo as titolo from brani where titolo like ? ORDER BY LEVENSHTEIN(titolo,?) LIMIT 5";
          connection.query(sql,[searched,searched],function (err,results) {
              if (err) {
                  return callback(err, null, 2);
              }
              if(results.length > 0) json.push({brani:results});
              sql =  "select codartista as codice, tipo as tipo, nome as nome, immagine as immagine from artista where nome like ? ORDER BY LEVENSHTEIN(nome,?) LIMIT 5";
              connection.query(sql,[searched,searched],function (err,results) {
                  if (err) {
                      return callback(err, null, 2);
                  }
                  if(results.length > 0) json.push({artisti:results});
                  sql =  "select codalbum as codice, anno as anno, immagine as immagine, titolo as titolo from album where titolo like ? ORDER BY LEVENSHTEIN(titolo,?) LIMIT 5";
                  connection.query(sql,[searched,searched],function (err,results) {
                      if (err) {
                          return callback(err, null, 2);
                      }
                      if(results.length > 0) json.push({album:results});
                      sql =  "select codutente as codice, username as username from utenti where username like ? ORDER BY LEVENSHTEIN(username,?) LIMIT 5";
                      connection.query(sql,[searched,searched],function (err,results) {
                          if (err) {
                              return callback(err, null, 2);
                          }
                          if(results.length > 0) json.push({utenti:results});
                          connection.release();
                          return callback(null,json,0);
                      });
                  });
              });
          });
      });
  }
};