var playlist_model = require('../../model/Playlist/Playlist');

module.exports = {
  playlist_giornaliera : function(data,callback){
      var mydata = new Date(data);
      playlist_model.playlist_giornaliera(mydata.getDay(), mydata.getHours(), function (err, succ, code) {
          if (err !== null){
              switch (code){
                  case 1:
                      return callback({code:1,text:"Errore connessione al database",errorCode:err.code,status:400});
                  case 2:
                      return callback({code:2,text:"Impossibile trovare la playlist",errorCode:err.code,status:400});
                  default:
                      return callback({code:3,text:"Errore indefinito",errorCode:err.code,status:400});
              }
          }else{
              return callback({code:0,data:succ,status:200});
          }
      });
  },

    get_nome_playlist : function(codPlaylist,callback){
        playlist_model.get_nome_playlist(codPlaylist, function (err, succ, code) {
            if (err !== null) {
                switch (code) {
                    case 1:
                        return callback({
                            code: 1,
                            text: "Errore connessione al database",
                            errorCode: err.code,
                            status: 400
                        });
                    case 2:
                        return callback({
                            code: 2,
                            text: "Impossibile trovare la playlist cercata",
                            errorCode: err.code,
                            status: 400
                        });
                    default:
                        return callback({code: 3, text: "Errore indefinito", errorCode: err.code, status: 400});
                }
            } else {
                return callback({code: 0, data:succ, status: 200});
            }
        });
    },


    get_brani_playlist : function (codPlaylist,callback) {
        playlist_model.get_brani_playlist(codPlaylist, function (err, succ, code) {
            if (err !== null) {
                switch (code) {
                    case 1:
                        return callback({
                            code: 1,
                            text: "Errore connessione al database",
                            errorCode: err.code,
                            status: 400
                        });
                    case 2:
                        return callback({
                            code: 2,
                            text: "Impossibile trovare le canzoni della playlist",
                            errorCode: err.code,
                            status: 400
                        });
                    default:
                        return callback({code: 3, text: "Errore indefinito", errorCode: err.code, status: 400});
                }
            } else {
                return callback({code: 0, data:succ, status: 200});
            }
        });
    },

    get_playlist_utente: function(username,callback){
        playlist_model.get_playlist_utente(username, function (err, succ, code) {
            if (err !== null) {
                switch (code) {
                    case 1:
                        return callback({
                            code: 1,
                            text: "Errore connessione al database",
                            errorCode: err.code,
                            status: 400
                        });
                    case 2:
                        return callback({
                            code: 2,
                            text: "nessun utente è associato a quest'username",
                            errorCode: err.code,
                            status: 400
                        });
                    case 3:
                        return callback({
                            code: 3,
                            text: "l'utente "+username+" non ha creato nessuna playlist",
                            errorCode: err.code,
                            status: 200
                        });
                    default:
                        return callback({code: 4, text: "Errore indefinito", errorCode: err.code, status: 400});
                }
            } else {
                return callback({code: 0, data:succ, status: 200});
            }
        });
    },

    new_playlist: function(email,nomePlaylist,callback){
        playlist_model.new_playlist(email,nomePlaylist, function (err, succ, code) {
            if (err !== null) {
                switch (code) {
                    case 1:
                        return callback({
                            code: 1,
                            text: "Errore connessione al database",
                            errorCode: err.code,
                            status: 400
                        });
                    default:
                        return callback({code: 2, text: "Impossibile creare la playlist", errorCode: err.code, status: 400});
                }
            } else {
                return callback({code: 0, data:succ, status: 200});
            }
        });
    },

    delete_playlist: function(email,nomePlaylist,callback){
        playlist_model.delete_playlist(email,nomePlaylist, function (err, succ, code) {
            if (err !== null) {
                switch (code) {
                    case 1:
                        return callback({
                            code: 1,
                            text: "Errore connessione al database",
                            errorCode: err.code,
                            status: 400
                        });
                    default:
                        return callback({code: 2, text: "Impossibile eliminare la playlist "+nomePlaylist, errorCode: err.code, status: 400});
                }
            } else {
                return callback({code: 0, data:succ, status: 200});
            }
        });
    },

    add_song_playlist: function(email,nomePlaylist,codbrano,callback){
        playlist_model.add_song_playlist(email,nomePlaylist,codbrano, function (err, succ, code) {
            if (err !== null) {
                switch (code) {
                    case 1:
                        return callback({
                            code: 1,
                            text: "Errore connessione al database",
                            errorCode: err.code,
                            status: 400
                        });
                    default:
                        return callback({code: 2, text: "Impossibile aggiungere la canzone alla playlist "+nomePlaylist, errorCode: err.code, status: 400});
                }
            } else {
                return callback({code: 0, data:succ, status: 200});
            }
        });
    },

    delete_song_playlist: function(email,nomePlaylist,codbrano,callback){
        playlist_model.delete_song_playlist(email,nomePlaylist,codbrano, function (err, succ, code) {
            if (err !== null) {
                switch (code) {
                    case 1:
                        return callback({
                            code: 1,
                            text: "Errore connessione al database",
                            errorCode: err.code,
                            status: 400
                        });
                    default:
                        return callback({code: 2, text: "Impossibile rimuovere la canzone dalla playlist "+nomePlaylist, errorCode: err.code, status: 400});
                }
            } else {
                return callback({code: 0, data:succ, status: 200});
            }
        });
    }
};