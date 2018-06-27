var search_model = require('../../model/Search/search');

module.exports = {
    get_search: function (stringa, callback) {
        var searched = stringa.replace(' ','%');
        search_model.get_search(searched, function (err, succ, code) {
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
                            text: "Impossibile effettuare la ricerca",
                            errorCode: err.code,
                            status: 400
                        });
                    default:
                        return callback({code: 3, text: "Errore indefinito", errorCode: err.code, status: 400});
                }
            } else {
                return callback({code: 0, data: succ, status: 200});
            }
        });
    }
};
